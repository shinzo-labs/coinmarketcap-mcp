#! /bin/sh

# Check that the package.json version matches the version in the MCP server

# Get package.json version
pkg_version=$(jq -r .version ../../package.json)

# Get MCP server version from index.js (look for 'version: "x.y.z"')
server_version=$(grep 'version:' ../../index.js | head -1 | sed -E 's/.*version: "([^"]+)".*/\1/')

# Compare versions
if [ "$pkg_version" != "$server_version" ]; then
  echo "Error: package.json version ($pkg_version) does not match MCP server version ($server_version) in index.js."
  exit 1
fi

# Exit with error if versions do not match

