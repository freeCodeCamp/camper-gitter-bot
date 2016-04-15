# pull down wiki files
# don't commit them back
# just used on prod server

# set -x

git submodule init
git submodule update --init --checkout --recursive --remote
# cd data/fcc.wiki
# git fetch
# git checkout master
# git pull origin master
