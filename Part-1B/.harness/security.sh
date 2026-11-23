#!/bin/sh
set -eu
if grep -R -nE 'sk-[A-Za-z0-9]{10,}|Bearer [A-Za-z0-9._-]{10,}' src prompts evals evidence --exclude='*.log' 2>/dev/null; then echo 'Potential secret detected' >&2; exit 1; fi
! grep -R -nE 'sendEmail|createCalendarEvent' src
