#!/usr/bin/env bash

set -x

# https://github.com/mochajs/mocha/issues/1498
# how to run with iojs ?

# GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
#     GITTER_APP_KEY=${GITTER_APP_KEY} \
#     GITTER_APP_SECRET=${GITTER_APP_SECRET} \
#     LOG_LEVEL=2 \
#     PORT=7891 \
#     BOT_APP_HOST=http://bot.freecodecamp.com \

# export SERVER_ENV=test

#SERVER_ENV=test \
#GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
#GITTER_APP_KEY=${GITTER_APP_KEY} \
#GITTER_APP_SECRET=${GITTER_APP_SECRET} \
#LOG_LEVEL=3 \
#PORT=7891 \

LOG_LEVEL=1 \
    mocha -w \
        --inline-diffs \
        --harmony --sort $1



#-r dotenv/config your_script.js