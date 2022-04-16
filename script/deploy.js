#!/bin/sh
ssh ubuntu@54.215.206.56 <<EOF
    cd ~/backend
    git pull origin main
    npm install
    pm2 restart ecosystem.config.js
    exit
EOF
