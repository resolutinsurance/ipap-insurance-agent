#!/usr/bin/env bash

set -euo pipefail

DRY_RUN=false
PRETTIER_CMD=()

for arg in "$@"; do
  case "$arg" in
    --dry-run|-n)
      DRY_RUN=true
      ;;
    --help|-h)
      echo "Usage: scripts/lint-format-changed.sh [--dry-run]"
      echo
      echo "Formats and lints only changed/untracked files in git."
      echo "  --dry-run, -n   Print files without changing them"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Try: scripts/lint-format-changed.sh --help" >&2
      exit 1
      ;;
  esac
done

resolve_prettier_cmd() {
  if command -v prettier >/dev/null 2>&1; then
    PRETTIER_CMD=(prettier)
    return 0
  fi

  if pnpm exec prettier --version >/dev/null 2>&1; then
    PRETTIER_CMD=(pnpm exec prettier)
    return 0
  fi

  if pnpm dlx prettier --version >/dev/null 2>&1; then
    PRETTIER_CMD=(pnpm dlx prettier)
    return 0
  fi

  return 1
}

CHANGED_FILES="$(
  {
    git diff --name-only --diff-filter=ACMR
    git diff --cached --name-only --diff-filter=ACMR
    git ls-files --others --exclude-standard
  } | sed '/^$/d' | sort -u
)"

if [[ -z "$CHANGED_FILES" ]]; then
  echo "No changed files found."
  exit 0
fi

FORMAT_FILES=()
LINT_FILES=()

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  [[ ! -f "$file" ]] && continue

  case "$file" in
    *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.mts|*.cts|*.json|*.css|*.scss|*.md|*.mdx|*.yml|*.yaml|*.html)
      FORMAT_FILES+=("$file")
      ;;
  esac

  case "$file" in
    *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.mts|*.cts)
      LINT_FILES+=("$file")
      ;;
  esac
done <<< "$CHANGED_FILES"

if [[ ${#FORMAT_FILES[@]} -eq 0 && ${#LINT_FILES[@]} -eq 0 ]]; then
  echo "No changed files match format/lint extensions."
  exit 0
fi

if [[ "$DRY_RUN" == "true" ]]; then
  if [[ ${#FORMAT_FILES[@]} -gt 0 ]]; then
    echo "Would format:"
    printf '  %s\n' "${FORMAT_FILES[@]}"
  fi

  if [[ ${#LINT_FILES[@]} -gt 0 ]]; then
    echo "Would lint:"
    printf '  %s\n' "${LINT_FILES[@]}"
  fi

  exit 0
fi

if [[ ${#FORMAT_FILES[@]} -gt 0 ]]; then
  if resolve_prettier_cmd; then
    echo "Formatting changed files with Prettier..."
    "${PRETTIER_CMD[@]}" --write "${FORMAT_FILES[@]}"
  else
    echo "Prettier not found. Install it with: pnpm add -D prettier" >&2
    exit 1
  fi
fi

if [[ ${#LINT_FILES[@]} -gt 0 ]]; then
  echo "Lint-fixing changed files with ESLint..."
  pnpm exec eslint --fix "${LINT_FILES[@]}"
fi

echo "Done."
