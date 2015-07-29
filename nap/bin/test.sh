source bin/credentials-bothelp.sh

set -x

# https://github.com/mochajs/mocha/issues/1498
# how to run with iojs ?

GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
    GITTER_APP_KEY=${GITTER_APP_KEY} \
    GITTER_APP_SECRET=${GITTER_APP_SECRET} \
    LOG_LEVEL=2 \
    mocha -w --harmony --sort $1
