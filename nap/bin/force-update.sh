
# we need to remove the /wiki directory
# to avoid git conflicts
rm -rf data/wiki/*md
git checkout .
git pull
