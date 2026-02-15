#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const SHARED_EXPORT_FILE_RELATIVE_PATHS = [
  'dist/components/index.d.ts',
  'src/components/index.ts',
  'src/components/index.tsx',
]
const SHARED_COMPONENTS_ENTRY = '@resolutinsurance/ipap-shared/components'
const DEFAULT_PROTECTED_SLUGS = new Set([])
const SUPPORTED_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mts',
  '.cts',
  '.mjs',
  '.cjs',
])

function parseArgs(argv) {
  const args = {
    target: path.resolve(process.cwd(), 'src/components/ui'),
    write: true,
    verbose: false,
    protectedSlugs: new Set(DEFAULT_PROTECTED_SLUGS),
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--target' || token === '-t') {
      args.target = argv[i + 1] ? path.resolve(argv[i + 1]) : args.target
      i += 1
      continue
    }
    if (token === '--dry-run') {
      args.write = false
      continue
    }
    if (token === '--write') {
      args.write = true
      continue
    }
    if (token === '--verbose' || token === '-v') {
      args.verbose = true
      continue
    }
    if (token === '--keep' || token === '-k') {
      const value = argv[i + 1] ? String(argv[i + 1]).trim() : ''
      if (value) {
        value
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean)
          .forEach((slug) => args.protectedSlugs.add(slug))
      }
      i += 1
      continue
    }
    if (!token.startsWith('-')) {
      args.target = path.resolve(token)
    }
  }

  return args
}

function toPascalCase(value) {
  return value
    .split(/[-_/]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function collectSharedExportFileCandidates() {
  const candidates = []

  for (const relativePath of SHARED_EXPORT_FILE_RELATIVE_PATHS) {
    candidates.push(path.resolve(process.cwd(), relativePath))
  }

  try {
    const componentsEntryPath = require.resolve(SHARED_COMPONENTS_ENTRY, {
      paths: [process.cwd()],
    })
    const componentsDir = path.dirname(componentsEntryPath)
    const packageRoot = path.resolve(componentsDir, '..', '..')

    candidates.push(path.resolve(componentsDir, 'index.d.ts'))
    candidates.push(path.resolve(componentsDir, 'index.js'))
    candidates.push(path.resolve(componentsDir, 'index.mjs'))

    for (const relativePath of SHARED_EXPORT_FILE_RELATIVE_PATHS) {
      candidates.push(path.resolve(packageRoot, relativePath))
    }
  } catch {
    // Continue with local candidates.
  }

  return [...new Set(candidates)]
}

function findSharedExportFile() {
  const candidates = collectSharedExportFileCandidates()
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  throw new Error(
    `Unable to locate shared component export file. Checked:\n${candidates.join('\n')}`,
  )
}

function detectProjectRoot(startPath) {
  let current = path.resolve(startPath)
  while (true) {
    const packageJsonPath = path.join(current, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }
  throw new Error(`Unable to locate project root from: ${startPath}`)
}

function parseSharedUiSlugs(content) {
  const slugs = new Set()
  const patterns = [
    /export\s*\{[\s\S]*?\}\s*from\s*["']\.\/ui\/([^"']+)["']/g,
    /export\s+\*\s+from\s*["']\.\/ui\/([^"']+)["']/g,
  ]

  for (const pattern of patterns) {
    let match = pattern.exec(content)
    while (match) {
      const slug = match[1]?.trim()
      if (slug) {
        slugs.add(slug)
      }
      match = pattern.exec(content)
    }
  }

  if (slugs.size === 0) {
    throw new Error(
      'No UI exports were found in the shared component export file.',
    )
  }

  return slugs
}

function rewriteImportsToLibrary(projectRoot, verbose) {
  const resolveScriptPath = path.join(projectRoot, 'scripts', 'resolve.mjs')
  if (!fs.existsSync(resolveScriptPath)) {
    if (verbose) {
      console.warn(`Skip import rewrite: ${resolveScriptPath} was not found.`)
    }
    return
  }

  const args = [resolveScriptPath, '--target', projectRoot, '--write']
  if (verbose) {
    args.push('--verbose')
  }
  execFileSync(process.execPath, args, {
    cwd: projectRoot,
    stdio: verbose ? 'inherit' : 'pipe',
  })
}

function collectTargetFiles(targetRoot) {
  if (!fs.existsSync(targetRoot)) {
    throw new Error(`Target path does not exist: ${targetRoot}`)
  }
  if (!fs.statSync(targetRoot).isDirectory()) {
    throw new Error(`Target path must be a directory: ${targetRoot}`)
  }

  const files = []

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (
          entry.name === 'node_modules' ||
          entry.name === '.next' ||
          entry.name === '.git'
        ) {
          continue
        }
        walk(fullPath)
        continue
      }
      if (!SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
        continue
      }
      files.push(fullPath)
    }
  }

  walk(targetRoot)
  return files
}

function getFileSlug(filePath, targetRoot) {
  const rel = path.relative(targetRoot, filePath).replace(/\\/g, '/')
  const noExt = rel.replace(/\.(t|j)sx?$/i, '')
  return noExt.replace(/\/index$/i, '')
}

function collectDuplicateFiles(targetRoot, sharedSlugs, protectedSlugs) {
  const files = collectTargetFiles(targetRoot)
  const duplicateFiles = []
  const skippedProtected = []

  for (const filePath of files) {
    const slug = getFileSlug(filePath, targetRoot)
    if (!sharedSlugs.has(slug)) {
      continue
    }
    if (protectedSlugs.has(slug)) {
      skippedProtected.push({
        filePath,
        slug,
      })
      continue
    }
    if (sharedSlugs.has(slug)) {
      duplicateFiles.push({
        filePath,
        slug,
        inferredName: toPascalCase(slug),
      })
    }
  }

  return { duplicateFiles, skippedProtected }
}

function removeEmptyDirectories(dirPath, stopAt) {
  if (!fs.existsSync(dirPath) || dirPath === stopAt) {
    return
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    return
  }

  const entries = fs.readdirSync(dirPath)
  if (entries.length > 0) {
    return
  }

  fs.rmdirSync(dirPath)
  removeEmptyDirectories(path.dirname(dirPath), stopAt)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const projectRoot = detectProjectRoot(args.target)
  const exportFile = findSharedExportFile()
  const exportContent = fs.readFileSync(exportFile, 'utf8')
  const sharedSlugs = parseSharedUiSlugs(exportContent)

  // Ensure app code points to shared components before deleting local duplicates.
  if (args.write) {
    rewriteImportsToLibrary(projectRoot, args.verbose)
  }

  const { duplicateFiles, skippedProtected } = collectDuplicateFiles(
    args.target,
    sharedSlugs,
    args.protectedSlugs,
  )

  if (args.verbose) {
    console.log(`Shared exports file: ${exportFile}`)
    console.log(`Target directory: ${args.target}`)
    console.log(`Project root: ${projectRoot}`)
    console.log(`Shared UI components discovered: ${sharedSlugs.size}`)
    if (args.protectedSlugs.size > 0) {
      console.log(
        `Protected slugs: ${Array.from(args.protectedSlugs).sort().join(', ')}`,
      )
    }
  }

  if ((args.verbose || !args.write) && skippedProtected.length > 0) {
    skippedProtected.forEach((entry) => {
      console.log(`SKIP PROTECTED ${entry.filePath} (slug: ${entry.slug})`)
    })
  }

  let removedCount = 0
  for (const duplicate of duplicateFiles) {
    if (args.write) {
      fs.unlinkSync(duplicate.filePath)
      removeEmptyDirectories(path.dirname(duplicate.filePath), args.target)
    }
    removedCount += 1

    if (args.verbose || !args.write) {
      console.log(
        `${args.write ? 'REMOVED' : 'WOULD REMOVE'} ${duplicate.filePath} (slug: ${duplicate.slug}, inferred: ${duplicate.inferredName})`,
      )
    }
  }

  if (duplicateFiles.length === 0) {
    console.log('No duplicate components found in target path.')
    return
  }

  if (!args.write) {
    console.log(
      `Dry run complete: would remove ${removedCount} duplicate file(s) from ${args.target}.`,
    )
    return
  }

  console.log(
    `Done: removed ${removedCount} duplicate file(s) from ${args.target}.`,
  )
}

function printUsage() {
  console.log(`Usage:
  node scripts/remove-duplicates.mjs [target]
  node scripts/remove-duplicates.mjs --target src/components/ui --dry-run --verbose

Options:
  -t, --target <path>  Directory to scan (default: src/components/ui)
  -k, --keep <slugs>   Comma-separated component slugs to never remove (default: sidebar)
  --dry-run            Show files that would be removed
  --write              Apply deletions (default)
  -v, --verbose        Print detailed output`)
}

try {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage()
    process.exit(0)
  }
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
