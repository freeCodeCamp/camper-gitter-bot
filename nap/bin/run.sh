source bin/credentials.sh

set -x

GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
    GITTER_APP_KEY=${GITTER_APP_KEY} \
    GITTER_APP_SECRET=${GITTER_APP_SECRET} \
    iojs app.js

    # node --harmony app.js
    # nodemon -x iojs app.js
