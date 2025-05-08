#!/bin/sh

output=$(.github/scripts/validate-versions.sh)
echo "$output"

if [[ "$output" == *"inc_count=1"* ]]; then
  npm install -g pnpm
  pnpm install --frozen-lockfile
  npm publish --access public
else
  echo "Skipping publish: Version not incremented correctly"
  exit 0
fi
