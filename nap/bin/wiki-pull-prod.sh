# pull down wiki files
# don't commit them back
# just used on prod server
# 
# used on the production server only

APPDIR=/home/freecodecamp/www/gitterbot/nap

alias rgit=/usr/bin/git


cd $APPDIR/data/fcc.wiki
rgit fetch
rgit checkout master
rgit pull origin master
cd $APPDIR

rm $APPDIR/data/wiki/*

cp $APPDIR/data/fcc.wiki/*md $APPDIR/data/wiki


