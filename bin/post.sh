source bin/credentials.sh

BOTZYROOM="55b1a9030fc9f982beaac901"

curl -X POST -i -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer ${GITTER_USER_TOKEN}" \
    "https://api.gitter.im/v1/rooms/${BOTZYROOM}/chatMessages" \
    -d '{"text":"curl test"}'
