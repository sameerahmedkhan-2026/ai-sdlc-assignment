#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm run type-check
npm test
npm run lint
npm run build
npm run evaluate
sh .harness/security.sh
npx tsx .harness/traceability.ts
