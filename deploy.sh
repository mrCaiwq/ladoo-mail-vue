#!/bin/bash

now=$(date +"%Y%m%d%H%M%S")

echo -e "***\033[32m 创建新文件夹 /var/www/html/mail_system/$now \033[0m***"
ssh root@113.88.96.174 "mkdir -p /var/www/html/mail_system/$now"

echo -e '***\033[32m 上传文件 \033[0m***'
scp -r dist/. root@113.88.96.174:/var/www/html/mail_system/$now

echo -e "***\033[32m 指向新文件夹 /var/www/html/mail_system/$now \033[0m***"
ssh root@113.88.96.174 "ln -sfn /var/www/html/mail_system/$now /var/www/html/mail_system/current"
