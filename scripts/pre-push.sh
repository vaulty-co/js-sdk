#!/bin/sh

cd packages/elements || exit 1
yarn lint || exit 1
yarn test || exit 1

cd ../library || exit 1
yarn lint || exit 1
yarn test || exit 1

cd ../playground || exit 1
yarn lint || exit 1

cd ../common || exit 1
yarn lint || exit 1
yarn test || exit 1
