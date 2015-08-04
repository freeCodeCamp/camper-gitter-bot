git checkout .
git clean -f
git reset --hard HEAD

# we need to remove the /wiki directory
# to avoid git conflicts
rm -rf data/wiki/*md

git pull
