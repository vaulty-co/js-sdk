#!/usr/bin/env sh

yarn install --force

cd ./packages/elements || exit 1

yarn build

cd ../../

echo "Build Docker image $1"

docker build . --tag $1 --file ./dockerfiles/Dockerfile.elements
