source bin/credentials-demobot.sh

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

SERVER_ENV=test \
GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
GITTER_APP_KEY=${GITTER_APP_KEY} \
GITTER_APP_SECRET=${GITTER_APP_SECRET} \
LOG_LEVEL=1 \
PORT=7891 \
    mocha -w \
        --inline-diffs \
        --harmony --sort $1

