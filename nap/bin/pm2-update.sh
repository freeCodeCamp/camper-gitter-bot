
set -x

approot="/home/freecodecamp/www/gitterbot/nap"

git pull && pm2 restart all && pm2 logs > "${approot}/logs/bot.log"
