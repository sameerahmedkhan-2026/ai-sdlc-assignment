#!/usr/bin/env bash
set -eu
if grep -RInE 'api[_-]?key|secret|password' --include='*.ts' --include='*.tsx' backend/src frontend/src packages/contracts/src; then
  echo "Potential hardcoded secret identifier found"; exit 1
fi
if grep -RInE 'authentication|notifications|external AI|cloud infrastructure' backend/src frontend/src packages/contracts/src; then
  echo "Excluded feature implementation detected"; exit 1
fi
if grep -RInE 'child_process|eval\(|new Function\(' --include='*.ts' --include='*.tsx' backend/src frontend/src packages/contracts/src; then
  echo "Potential unsafe code execution detected"; exit 1
fi
echo "Security and excluded-scope checks passed (keyword/static checks only; this is not full SAST)"
