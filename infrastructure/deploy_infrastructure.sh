#!/bin/sh

terraform init
terraform apply -auto-approve

POSTGRESQL_PASSWORD=$(terraform output -raw rds_db_password)
POSTGRESQL_HOST=$(terraform output -raw rds_instance_public_ip)
POSTGRESQL_USER=$(terraform output -raw rds_db_username)
POSTGRESQL_PORT=$(terraform output -raw rds_db_port)
POSTGRESQL_DB=$POSTGRESQL_USER

EC2_PUBLIC_IP=$(terraform output -raw elastic_public_ip)
EC2_KEY_NAME=$(terraform output -raw instance_ssh_key_name)
NAME_SERVERS=$(terraform output -json name_servers)

echo "" > .infrastructure_output

echo "POSTGRESQL_USER=${POSTGRESQL_USER}" >> .infrastructure_output
echo "POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD}" >> .infrastructure_output
echo "POSTGRESQL_HOST=${POSTGRESQL_HOST}" >> .infrastructure_output
echo "POSTGRESQL_PORT=${POSTGRESQL_PORT}" >> .infrastructure_output
echo "POSTGRESQL_DB=${POSTGRESQL_DB}" >> .infrastructure_output
echo "EC2_KEY_NAME=${EC2_KEY_NAME}" >> .infrastructure_output
echo "EC2_PUBLIC_IP=${EC2_PUBLIC_IP}" >> .infrastructure_output
