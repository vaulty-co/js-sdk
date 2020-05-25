#!/usr/bin/env sh

yarn workspaces run lint || exit 1
yarn workspaces run test || exit 1
