#!/usr/bin/env bash

set -x
bin/wiki-update.sh
ssh freecodecamp@104.131.2.16 "cd /home/freecodecamp/www/gitterbot/nap && \
    git clean -f && \
    git checkout . && \
    git pull && \
    pm2 restart all"


    # bin/pm2-update.sh"
