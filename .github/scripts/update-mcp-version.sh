#! /bin/sh

version=$(jq -r .version package.json)

sed -i "s/version: \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version: \"$version\"/g" $PATH_TO_FILE

if git diff --quiet $PATH_TO_FILE; then
  echo "No changes to MCP version, skipping commit"
else
  git config --global user.email "github-actions[bot]@users.noreply.github.com"
  git config --global user.name "github-actions[bot]"
  git add $PATH_TO_FILE
  git commit -m "Update MCP version to $version"
  branch="${GITHUB_REF_NAME:-main}"
  if [[ "$branch" =~ ^[a-zA-Z0-9._/-]+$ ]] && [[ ! "$branch" =~ /merge$ ]] && [[ ! "$branch" =~ ^pull/ ]]; then
    git push origin HEAD:refs/heads/$branch
  else
    echo "Not on a real branch (branch=$branch), skipping push."
  fi
fi
