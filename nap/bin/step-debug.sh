# open "http://localhost:8080/?ws=localhost:8080&port=5858" &

source bin/credentials-link.sh

set -x

GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
    GITTER_APP_KEY=${GITTER_APP_KEY} \
    GITTER_APP_SECRET=${GITTER_APP_SECRET} \
    LOG_LEVEL=10 \
    PORT=7891 \
    iojs debug app.js

    # node-debug --harmony app.js
    # nodemon -x iojs app.js
    # nodemon --harmony app.js
    # node-debug --harmony app.js

