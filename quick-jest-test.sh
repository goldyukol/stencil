#!/bin/bash

set -e

npm ci
npm run clean
npm run build
npm pack
mv $(ls -t *.tgz | head -1) stencil-eval.tgz
npm init stencil component tmp-component-starter
cd tmp-component-starter
npm install
npm i ../stencil-eval.tgz
npm run build
for VERSION in 27 28
do
  npm i -D jest@$VERSION jest-cli@$VERSION @types/jest@$VERSION
  npm run test -- --no-build
done
cd ..
rm -rf tmp-component-starter
