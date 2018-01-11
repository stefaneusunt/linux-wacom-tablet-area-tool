#!/usr/bin/env bash
rm -rf ./build
rm -rf ./packaged-app
npm run build
cp -R ./dist ./build/
cp ./index.html ./build/
cp ./electron-main.js ./build/
cp ./package.json ./build/

./node_modules/.bin/electron-packager ./build --asar --out=./packaged-app

rm -rf ./build