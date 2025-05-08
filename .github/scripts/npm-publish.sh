#!/bin/sh

npm install -g pnpm
pnpm install --frozen-lockfile
npm publish --provenance --access public
