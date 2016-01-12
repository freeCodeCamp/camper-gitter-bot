



source bin/credentials-camperbot.sh

set -x

SERVER_ENV=prod \
GITTER_USER_TOKEN=${GITTER_USER_TOKEN} \
GITTER_APP_KEY=${GITTER_APP_KEY} \
GITTER_APP_SECRET=${GITTER_APP_SECRET} \
LOG_LEVEL=10 \
PORT=7891 \
    pm2 start --name bot --interpreter iojs  app.js

    # iojs app.js
    # node --harmony app.js
    # nodemon -x iojs app.js

pm2 list
pm2 logs all
