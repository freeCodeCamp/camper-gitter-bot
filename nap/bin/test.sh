source bin/credentials-bothelp.sh

set -x

# https://github.com/mochajs/mocha/issues/1498
# how to run with iojs ?

# GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
#     GITTER_APP_KEY=${GITTER_APP_KEY} \
#     GITTER_APP_SECRET=${GITTER_APP_SECRET} \
#     LOG_LEVEL=2 \
#     PORT=7891 \
#     BOT_APP_HOST=http://bot.freecodecamp.com \


SERVER_ENV=test \
BOTNAME=bothelp \
BOT_APP_HOST=bot.freecodecamp.com \
GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
GITTER_APP_KEY=${GITTER_APP_KEY} \
GITTER_APP_SECRET=${GITTER_APP_SECRET} \
LOG_LEVEL=10 \
PORT=7891 \     
    mocha -w --harmony --sort $1
