#!/bin/sh
cd /var/www/app/poc-fe-welcoming-call && npm install
cd /var/www/app/poc-fe-welcoming-call && pm2 stop poc-fe-welcoming-call
cd /var/www/app/poc-fe-welcoming-call && pm2 delete poc-fe-welcoming-call
cd /var/www/app/poc-fe-welcoming-call && pm2 start pm2.json
