#! /bin/sh

version=$(jq -r .version package.json)

sed -i "s/version: \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version: \"$version\"/g" $PATH_TO_FILE

if git diff --quiet $PATH_TO_FILE; then
  echo "No changes to MCP version, skipping commit"
else
  git add $PATH_TO_FILE
  git commit -m "Update MCP version to $version"
  git push
fi
