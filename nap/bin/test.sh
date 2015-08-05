#!/usr/bin/env bash

set -x

LOG_LEVEL=3 \
    mocha -w \
        --inline-diffs \
        --harmony --sort $1

