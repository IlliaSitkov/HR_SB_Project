#!/bin/sh

# import .env
set -a
. ./.env
set +a

# certificate name
EC2_KEY_NAME_WITH_EXTENSION="${EC2_KEY_NAME}.pem"

# add permission to the certificate
chmod 400 $EC2_KEY_NAME_WITH_EXTENSION
# copy .env to the ec2
scp -i $EC2_KEY_NAME_WITH_EXTENSION .env ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/

# copy backend files
ssh -tt -i $EC2_KEY_NAME_WITH_EXTENSION ec2-user@$EC2_PUBLIC_IP 'rm rm -rf backend'
ssh -tt -i $EC2_KEY_NAME_WITH_EXTENSION ec2-user@$EC2_PUBLIC_IP 'mkdir -p backend'
scp -i $EC2_KEY_NAME_WITH_EXTENSION ./backend/.env ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/backend/
scp -i $EC2_KEY_NAME_WITH_EXTENSION ./backend/backend.service ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/backend/
scp -i $EC2_KEY_NAME_WITH_EXTENSION -r ./backend/dist ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/backend/dist
scp -i $EC2_KEY_NAME_WITH_EXTENSION -r ./backend/prisma ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/backend/prisma
scp -i $EC2_KEY_NAME_WITH_EXTENSION ./backend/package.json ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/backend/
scp -i $EC2_KEY_NAME_WITH_EXTENSION ./backend/package-lock.json ec2-user@$EC2_PUBLIC_IP:/home/ec2-user/backend/

# establish ssh and execute the following script
ssh -tt -i $EC2_KEY_NAME_WITH_EXTENSION ec2-user@$EC2_PUBLIC_IP << "ENDSSH"
sudo yum -y install curl
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
# setup backend
cd backend
npm install
cd ..
# start services
sudo cp backend/backend.service /etc/systemd/system/backend.service
chmod +x backend/backend.sh
sudo systemctl daemon-reload
sudo systemctl enable backend
sudo systemctl start backend
exit
ENDSSH
