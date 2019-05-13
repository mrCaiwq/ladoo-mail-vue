#!/bin/bash

now=$(date +"%Y%m%d%H%M%S")

echo -e "***\033[32m 创建新文件夹 /var/www/html/mailing_frontend/$now \033[0m***"
ssh root@47.112.137.116 "mkdir -p /var/www/html/mailing_frontend/$now"

echo -e '***\033[32m 上传文件 \033[0m***'
scp -r dist/* root@47.112.137.116:/var/www/html/mailing_frontend/$now

echo -e "***\033[32m 指向新文件夹 /var/www/html/mailing_frontend/$now \033[0m***"
ssh root@47.112.137.116 "ln -sfn /var/www/html/mailing_frontend/$now /var/www/html/mailing_frontend/current"
