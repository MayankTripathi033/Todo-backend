#!/bin/bash
cd /home/ec2-user/Todo-backend
pm2 start npm --name "Todo-backend" -- run start
