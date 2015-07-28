source bin/credentials.sh

set -x

GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
    GITTER_APP_KEY=${GITTER_APP_KEY} \
    GITTER_APP_SECRET=${GITTER_APP_SECRET} \
    nodemon -x iojs app.js
    # nodemon --harmony app.js
    # node-debug --harmony app.js

