# edit this file and save it as credentials.sh
# 
# or, create a new file like credentials-ENV.sh
# and symlink it
# $ ln -s credentials-ENV.sh credentials.sh
# this file is included in other run commands

GITTER_APP_KEY=XXXX
GITTER_APP_SECRET=XXXX
GITTER_APP_REDIRECT_URL=http://localhost:7000/login/callback

# you can get this after logging in once via the web 
# seems to be a long living token so we can just get it from here
# rather than using oauth redirect complexity
GITTER_USER_TOKEN=XXXX
