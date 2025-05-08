#!/bin/sh

npm install -g pnpm
pnpm install --frozen-lockfile
npm publish --access public
