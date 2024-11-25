#!/bin/bash

# node.js and npm installation
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "Node.js and npm are required but were not found. Please install them."
  exit 1
fi

# Install npm packages
echo "-> Installing npm packages..."
npm install
echo

# Run migrations
echo "-> Running migrations..."
npx prisma migrate deploy
echo

# Check compilers/interpreters
# Function to check command existence
check_command() {
  version_output="$($1 --version 2>&1)"
  if [ $? -ne 0 ]; then
    echo "$2 is required but was not found. Please install $2."
    # exit 1
  fi
  echo "$2: $version_output"
  echo
}

check_command docker "Docker"

check_docker_ps() {
  docker_ps_output="$(docker ps)"
  if [ $? -ne 0 ]; then
    echo "Cannot run docker command: docker ps"
    echo "Possibly you need to add docker to your groups"
    echo "$docker_ps_output"
    exit 1
  fi
  echo "Docker is running"
  echo "$docker_ps_output"
  echo
}

check_docker_ps

# docker ps
echo "-> Building docker images..."
node ./startup/buildImages.js
echo

# Create admin user
echo "-> Creating admin user..."
node ./startup/createAdmin.js
echo

echo "-> Startup script completed."