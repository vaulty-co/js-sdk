#!/bin/sh

cd packages/elements || exit 1
yarn lint
yarn test

cd ../library || exit 1
yarn lint
yarn test

cd ../playground || exit 1
yarn lint

cd ../utils || exit 1
yarn lint
yarn test
