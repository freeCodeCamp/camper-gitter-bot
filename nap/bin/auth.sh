source bin/credentials.sh

# this doesnt seem to work
# https://developer.gitter.im/docs/authentication


set -x
echo "client_id=${GITTER_APP_KEY}\n"

curl -i -X POST https://gitter.im/login/oauth/token \
  -d"client_id=${GITTER_APP_KEY}" \
  -d"client_secret=${GITTER_APP_SECRET}" \
  -d"code=CODE" \
  -d"grant_type=authorization_code" \
  -d"redirect_uri=${GITTER_APP_REDIRECT_URL}"