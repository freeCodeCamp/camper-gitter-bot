# pull down wiki files

cd data/fcc.wiki
git fetch
git checkout master
git pull origin master
cd ../..

rm data/wiki/*

cp data/fcc.wiki/*md data/wiki
