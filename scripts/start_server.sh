#!/bin/bash
cd /home/ec2-user/Todo-backend
pm2 start server.js --name todo-backend
