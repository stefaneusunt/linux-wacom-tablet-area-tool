#!/usr/bin/env bash
mkdir dist
npm run build
./node_modules/.bin/electron .