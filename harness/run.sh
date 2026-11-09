#!/usr/bin/env bash
set -euo pipefail
mkdir -p harness/evidence
run_check() {
  name="$1"; shift
  command_text=$(printf '%q ' "$@")
  {
    printf 'Command: %s\n' "$command_text"
    printf 'Started: %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    echo "== $name =="
    "$@"
  } 2>&1 | tee "harness/evidence/${name}.log"
  status=${PIPESTATUS[0]}
  printf 'Exit code: %s\n' "$status" | tee -a "harness/evidence/${name}.log"
  if [ "$status" -ne 0 ]; then exit "$status"; fi
}
run_check lint npm run lint
run_check type-check npm run type-check
run_check build npm run build
run_check unit npm run test:unit
run_check contract npm run test:contract
run_check integration npm run test:integration
run_check ui npm run test:ui
run_check security bash harness/checks/security.sh
run_check dependency bash harness/checks/dependencies.sh
run_check performance node --import tsx/esm harness/checks/performance.mjs
run_check acceptance node --import tsx/esm harness/checks/acceptance.mjs
run_check traceability node harness/checks/traceability.mjs
