open "http://localhost:8080/?ws=localhost:8080&port=5858" &

source bin/credentials.sh

set -x

GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
    GITTER_APP_KEY=${GITTER_APP_KEY} \
    GITTER_APP_SECRET=${GITTER_APP_SECRET} \
    node-debug --harmony app.js

    # nodemon -x iojs app.js
    # nodemon --harmony app.js
    # node-debug --harmony app.js

