# pull down wiki files

# submodules, whats not to like?
# http://stackoverflow.com/questions/14768509/unable-to-checkout-git-submodule-path

# do this first time
# git clone --recursive
# git clone --recurse-submodules

# set -x

## DONT update submodules
# http://stackoverflow.com/questions/5828324/update-git-submodule-to-latest-commit-on-origin

# git submodule update --init --recursive
# git submodule update
# git submodule foreach git fetch
# git fetch --recurse-submodules

# cd data/kbase.wiki
# git checkout master
# git pull origin master
# cd ../..

cd data/fcc.wiki
git pull origin master
git checkout master
cd ../..

rm data/wiki/*

cp data/kbase.wiki/*md data/wiki
cp data/fcc.wiki/*md data/wiki

git commit -am "Pulled down update to submodules and merged"
git pull 
git push