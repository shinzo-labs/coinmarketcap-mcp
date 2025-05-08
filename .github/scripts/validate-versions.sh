#! /bin/sh

pkg_version=$(jq -r .version package.json)

server_version=$(grep 'version:' index.js | head -1 | sed -E 's/.*version: "([^"]+)".*/\1/')

if [ "$pkg_version" != "$server_version" ]; then
  echo "Error: package.json version ($pkg_version) does not match MCP server version ($server_version) in index.js."
  exit 1
fi
