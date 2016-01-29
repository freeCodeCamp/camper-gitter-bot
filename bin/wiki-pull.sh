# pull down wiki files
# don't commit them back
# just used on prod server

# set -x

cd data/fcc.wiki
git fetch
# git checkout master
git pull origin master
