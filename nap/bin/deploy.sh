
set -x
bin/wiki-update.sh
ssh freecodecamp@104.131.2.16 "cd /home/freecodecamp/www/gitterbot/nap && git pull && bin/pm2-update.sh"
