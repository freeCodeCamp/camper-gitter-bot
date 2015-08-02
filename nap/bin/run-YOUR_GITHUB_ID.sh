

# bin/update-wiki.sh

source bin/credentials-YOUR_GITHUB_ID.sh
# source bin/credentials-bothelp.sh

set -x

SERVER_ENV=YOUR_GITHUB_ID \
GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
GITTER_APP_KEY=${GITTER_APP_KEY} \
GITTER_APP_SECRET=${GITTER_APP_SECRET} \
LOG_LEVEL=10 \
PORT=7891 \
    nodemon -x iojs app.js

    # nodemon --harmony app.js
