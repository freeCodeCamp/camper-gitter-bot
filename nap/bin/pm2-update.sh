
set -x

git pull && pm2 restart all && pm2 logs > 
