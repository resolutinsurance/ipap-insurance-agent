#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const PACKAGE_COMPONENTS_IMPORT = '@resolut/ipap-shared/components'
const SHARED_PACKAGE_NAME = '@resolut/ipap-shared'
const CANDIDATE_EXPORT_FILE_RELATIVE_PATHS = [
  'dist/components/index.d.ts',
  'src/components/index.ts',
  'src/components/index.tsx',
  'components/index.ts',
  'components/index.tsx',
]
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
    target: process.cwd(),
    exportsFile: null,
    write: true,
    verbose: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--target' || token === '-t') {
      args.target = argv[i + 1] ? path.resolve(argv[i + 1]) : args.target
      i += 1
      continue
    }
    if (token === '--exports-file' || token === '-e') {
      args.exportsFile = argv[i + 1] ? path.resolve(argv[i + 1]) : null
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
    if (!token.startsWith('-')) {
      args.target = path.resolve(token)
    }
  }

  return args
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
  return path.resolve(startPath)
}

function toPascalCase(value) {
  return value
    .split(/[-_/]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function collectExportFileCandidates(nextAppRoot) {
  const candidateFiles = CANDIDATE_EXPORT_FILE_RELATIVE_PATHS.map(
    (relativePath) => path.resolve(nextAppRoot, relativePath),
  )

  try {
    const componentsEntryPath = require.resolve(PACKAGE_COMPONENTS_IMPORT, {
      paths: [nextAppRoot, process.cwd()],
    })
    const componentsDir = path.dirname(componentsEntryPath)
    const packageRoot = path.resolve(componentsDir, '..', '..')

    candidateFiles.unshift(path.resolve(componentsDir, 'index.d.ts'))
    candidateFiles.unshift(
      path.resolve(packageRoot, 'dist/components/index.d.ts'),
    )
  } catch {
    // Keep local fallback candidates.
  }

  return [...new Set(candidateFiles)]
}

function findExportFile(nextAppRoot, explicitExportFile = null) {
  if (explicitExportFile) {
    return fs.existsSync(explicitExportFile) ? explicitExportFile : null
  }

  const candidateFiles = collectExportFileCandidates(nextAppRoot)

  for (const file of candidateFiles) {
    if (fs.existsSync(file)) {
      return file
    }
  }

  return null
}

function parseUiExports(content) {
  const exportBySlug = new Map()
  const allExports = new Set()
  const re = /export\s*\{([\s\S]*?)\}\s*from\s*["']\.\/ui\/([^"']+)["'];/g
  let match = re.exec(content)

  while (match) {
    const rawSpecList = match[1]
    const slug = match[2]
    const names = new Set()

    const specs = rawSpecList
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    for (const spec of specs) {
      let token = spec.replace(/^type\s+/, '').trim()
      if (!token) {
        continue
      }

      if (token.includes(' as ')) {
        token =
          token
            .split(/\s+as\s+/)
            .pop()
            ?.trim() || token
      }

      names.add(token)
      allExports.add(token)
    }

    exportBySlug.set(slug, names)
    match = re.exec(content)
  }

  if (exportBySlug.size === 0) {
    throw new Error('No UI exports were found in the component export file.')
  }

  return { exportBySlug, allExports }
}

function extractUiSlugFromSpecifier(specifier, sourceFilePath, nextAppRoot) {
  const normalized = specifier.replace(/\\/g, '/')

  const marker = 'components/ui/'
  const markerIndex = normalized.indexOf(marker)
  if (markerIndex >= 0) {
    const slugCandidate = normalized
      .slice(markerIndex + marker.length)
      .replace(/\.(t|j)sx?$/i, '')
    if (slugCandidate) {
      return slugCandidate
    }
  }

  if (!specifier.startsWith('.')) {
    return null
  }

  // Fast path: handle relative forms like ../ui/search-box without relying on fs resolution.
  const relativeUiMatch = normalized.match(/(?:^|\/)ui\/(.+)$/)
  if (relativeUiMatch?.[1]) {
    return relativeUiMatch[1]
      .replace(/\.(t|j)sx?$/i, '')
      .replace(/\/index$/i, '')
  }

  const baseResolved = path.resolve(path.dirname(sourceFilePath), specifier)
  const candidatePaths = [
    baseResolved,
    ...Array.from(SUPPORTED_EXTENSIONS).map((ext) => `${baseResolved}${ext}`),
    ...Array.from(SUPPORTED_EXTENSIONS).map((ext) =>
      path.join(baseResolved, `index${ext}`),
    ),
  ]

  const uiRoots = [
    path.resolve(nextAppRoot, 'src/components/ui'),
    path.resolve(nextAppRoot, 'components/ui'),
  ]

  for (const candidate of candidatePaths) {
    if (!fs.existsSync(candidate)) {
      continue
    }

    for (const uiRoot of uiRoots) {
      const rel = path.relative(uiRoot, candidate)
      if (rel.startsWith('..') || path.isAbsolute(rel)) {
        continue
      }

      const noExt = rel.replace(/\.(t|j)sx?$/i, '')
      return noExt.replace(/\/index$/, '').replace(/\\/g, '/')
    }
  }

  return null
}

function loadExports(nextAppRoot, explicitExportFile = null) {
  const exportFile = findExportFile(nextAppRoot, explicitExportFile)
  if (exportFile) {
    const exportContent = fs.readFileSync(exportFile, 'utf8')
    return {
      ...parseUiExports(exportContent),
      source: `export file: ${exportFile}`,
    }
  }

  const explicitHint = explicitExportFile
    ? `\nProvided --exports-file did not exist: ${explicitExportFile}`
    : ''
  throw new Error(
    `Unable to locate shared export file for ${SHARED_PACKAGE_NAME}.${explicitHint}
Checked:
${collectExportFileCandidates(nextAppRoot).join('\n')}

Fix:
- install ${SHARED_PACKAGE_NAME}, or
- pass --exports-file <path-to-components-index.d.ts>.`,
  )
}

function isUnderUiSource(fileOrDirPath, nextAppRoot) {
  const rel = path
    .relative(nextAppRoot, fileOrDirPath)
    .replace(/\\/g, '/')
    .replace(/\/+$/, '')
  return (
    rel === 'src/components/ui' ||
    rel.startsWith('src/components/ui/') ||
    rel === 'components/ui' ||
    rel.startsWith('components/ui/')
  )
}

function collectTargetFiles(targetPath, nextAppRoot) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`)
  }

  const files = []
  const targetResolved = path.resolve(targetPath)
  const rootResolved = path.resolve(nextAppRoot)
  const scanSpecificPath = targetResolved !== rootResolved
  const skipUiSource = !scanSpecificPath

  const roots = [
    path.join(nextAppRoot, 'app'),
    path.join(nextAppRoot, 'components'),
    path.join(nextAppRoot, 'src/app'),
    path.join(nextAppRoot, 'src/components'),
  ]

  function walk(dir) {
    if (!fs.existsSync(dir)) {
      return
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (
          entry.name === 'node_modules' ||
          entry.name === '.next' ||
          (skipUiSource && isUnderUiSource(fullPath, nextAppRoot))
        ) {
          continue
        }
        walk(fullPath)
        continue
      }
      if (skipUiSource && isUnderUiSource(fullPath, nextAppRoot)) {
        continue
      }
      if (!SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
        continue
      }
      files.push(fullPath)
    }
  }

  if (scanSpecificPath) {
    const stat = fs.statSync(targetResolved)
    if (stat.isDirectory()) {
      walk(targetResolved)
    } else if (stat.isFile()) {
      if (SUPPORTED_EXTENSIONS.has(path.extname(targetResolved))) {
        files.push(targetResolved)
      }
    }
  } else {
    roots.forEach(walk)
  }

  return files
}

function buildNamedImportSpec(spec) {
  const imported = spec.propertyName?.getText() || spec.name.getText()
  const local = spec.name.getText()
  const typePrefix = spec.isTypeOnly ? 'type ' : ''
  if (imported === local) {
    return `${typePrefix}${imported}`
  }
  return `${typePrefix}${imported} as ${local}`
}

function buildNamedFromDefault(localName, slug, availableExports) {
  if (availableExports.has(localName)) {
    return localName
  }

  const inferred = toPascalCase(slug)
  if (availableExports.has(inferred)) {
    return inferred === localName ? inferred : `${inferred} as ${localName}`
  }

  if (availableExports.size === 1) {
    const [onlyName] = availableExports
    return onlyName === localName ? onlyName : `${onlyName} as ${localName}`
  }

  return null
}

function rewriteImportsInFile(filePath, nextAppRoot, exportBySlug, allExports) {
  const sourceText = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const edits = []

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue
    }
    if (!ts.isStringLiteral(statement.moduleSpecifier)) {
      continue
    }

    const originalModule = statement.moduleSpecifier.text
    const importClause = statement.importClause
    if (!importClause) {
      continue
    }

    let availableExports = null
    const slug = extractUiSlugFromSpecifier(
      originalModule,
      filePath,
      nextAppRoot,
    )
    const isUiBarrelImport = originalModule.includes('components/ui') && !slug

    if (slug) {
      availableExports = exportBySlug.get(slug) || null
      if (!availableExports) {
        continue
      }
    } else if (isUiBarrelImport) {
      availableExports = allExports
    } else {
      continue
    }

    if (
      importClause.namedBindings &&
      ts.isNamespaceImport(importClause.namedBindings)
    ) {
      continue
    }

    const namedSpecs = []
    let hasUnsupported = false

    if (importClause.name) {
      const defaultSpec = buildNamedFromDefault(
        importClause.name.text,
        slug || 'components-ui',
        availableExports,
      )
      if (!defaultSpec) {
        hasUnsupported = true
      } else {
        namedSpecs.push(defaultSpec)
      }
    }

    if (
      importClause.namedBindings &&
      ts.isNamedImports(importClause.namedBindings)
    ) {
      for (const element of importClause.namedBindings.elements) {
        const importedName = element.propertyName
          ? element.propertyName.text
          : element.name.text
        if (!availableExports.has(importedName)) {
          hasUnsupported = true
          continue
        }
        namedSpecs.push(buildNamedImportSpec(element))
      }
    }

    if (hasUnsupported || namedSpecs.length === 0) {
      continue
    }

    const importTypePrefix =
      importClause.isTypeOnly &&
      !namedSpecs.some((spec) => !spec.startsWith('type '))
        ? 'type '
        : ''
    const newImport = `import ${importTypePrefix}{ ${namedSpecs.join(
      ', ',
    )} } from "${PACKAGE_COMPONENTS_IMPORT}";`

    edits.push({
      start: statement.getStart(source),
      end: statement.getEnd(),
      replacement: newImport,
      before: sourceText.slice(statement.getStart(source), statement.getEnd()),
    })
  }

  if (edits.length === 0) {
    return { changed: false, count: 0, preview: [] }
  }

  let updated = sourceText
  const preview = []
  edits
    .sort((a, b) => b.start - a.start)
    .forEach((edit) => {
      preview.push({ before: edit.before, after: edit.replacement })
      updated = `${updated.slice(0, edit.start)}${edit.replacement}${updated.slice(
        edit.end,
      )}`
    })

  return {
    changed: updated !== sourceText,
    count: edits.length,
    updated,
    preview: preview.reverse(),
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const projectRoot = detectProjectRoot(args.target)
  const { exportBySlug, allExports, source } = loadExports(
    projectRoot,
    args.exportsFile,
  )

  const files = collectTargetFiles(args.target, projectRoot)
  let touchedFiles = 0
  let rewrittenImports = 0

  if (args.verbose) {
    console.log(`Using component exports from ${source}`)
  }

  for (const filePath of files) {
    const result = rewriteImportsInFile(
      filePath,
      projectRoot,
      exportBySlug,
      allExports,
    )
    if (!result.changed) {
      continue
    }

    touchedFiles += 1
    rewrittenImports += result.count

    if (args.write) {
      fs.writeFileSync(filePath, result.updated, 'utf8')
    }

    if (args.verbose || !args.write) {
      console.log(`\n${args.write ? 'UPDATED' : 'WOULD UPDATE'} ${filePath}`)
      result.preview.forEach((entry) => {
        console.log(`- ${entry.before.trim()}`)
        console.log(`+ ${entry.after}`)
      })
    }
  }

  console.log(
    `${
      args.write ? 'Done' : 'Dry run complete'
    }: rewrote ${rewrittenImports} import(s) across ${touchedFiles} file(s).`,
  )
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
