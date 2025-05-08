#! /bin/sh

BASE_BRANCH=${GITHUB_BASE_REF:-main}
git fetch origin $BASE_BRANCH

pkg_version=$(jq -r .version package.json)
base_version=$(git show origin/$BASE_BRANCH:package.json | jq -r .version)

IFS='.' read -r pkg_major pkg_minor pkg_patch <<EOF
$pkg_version
EOF
IFS='.' read -r base_major base_minor base_patch <<EOF
$base_version
EOF

inc_count=0

if [ "$pkg_major" -eq $((base_major + 1)) ] && [ "$pkg_minor" -eq 0 ] && [ "$pkg_patch" -eq 0 ]; then
  inc_count=1
elif [ "$pkg_major" -eq "$base_major" ] && [ "$pkg_minor" -eq $((base_minor + 1)) ] && [ "$pkg_patch" -eq 0 ]; then
  inc_count=1
elif [ "$pkg_major" -eq "$base_major" ] && [ "$pkg_minor" -eq "$base_minor" ] && [ "$pkg_patch" -eq $((base_patch + 1)) ]; then
  inc_count=1
fi

# Only check if inc_count is not 0 or 1
if [ "$inc_count" -ne 0 ] && [ "$inc_count" -ne 1 ]; then
  echo "Error: Version must increment exactly one of major, minor, or patch by 1 (and reset lower segments if major/minor is incremented)."
  echo "Base branch version: $base_version"
  echo "PR version: $pkg_version"
  exit 1
fi

server_version=$(grep 'version:' index.js | head -1 | sed -E 's/.*version: "([^"]+)".*/\1/')

if [ "$pkg_version" != "$server_version" ]; then
  echo "Error: package.json version ($pkg_version) does not match MCP server version ($server_version) in index.js."
  exit 1
fi

# Return the value of inc_count
echo "inc_count=$inc_count"
