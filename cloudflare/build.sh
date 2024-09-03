#!/bin/bash

npm install
npm run build-page
shopt -s extglob
rm -rf !(_worker.js|web)

