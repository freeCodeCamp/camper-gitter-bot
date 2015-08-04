#!/usr/bin/env bash
set -x

approot="/home/freecodecamp/www/gitterbot/nap"
logpath="${approot}/logs/bot.log"

git pull && pm2 restart all && pm2 logs > $logpath &&
tail -f $logpath
