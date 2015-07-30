# pull down wiki files

# submodules, whats not to like?
# http://stackoverflow.com/questions/14768509/unable-to-checkout-git-submodule-path

# do this first time
# git clone --recursive
# git clone --recurse-submodules

set -x

git submodule update --init --recursive
git submodule foreach git fetch
git fetch --recurse-submodules
git submodule update

cd data/kbase.wiki
git pull origin master
cd ../..

cd data/fcc.wiki
git pull origin master
cd ../..


cp data/kbase.wiki/*md data/wiki
cp data/fcc.wiki/*md data/wiki
