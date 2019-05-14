#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
    host=47.112.137.116
    dir=/var/www/html/mailing_frontend
else
    host=47.88.12.142
    dir=/var/www/html/mail_system
fi

now=$(date +"%Y%m%d%H%M%S")

echo -e "***\033[32m 创建新文件夹 $dir/$now \033[0m***"
ssh root@$host "mkdir -p $dir/$now"

echo -e '***\033[32m 上传文件 \033[0m***'
scp -r dist/* root@$host:$dir/$now

echo -e "***\033[32m 指向新文件夹 $dir/$now \033[0m***"
ssh root@$host "ln -sfn $dir/$now $dir/current"
