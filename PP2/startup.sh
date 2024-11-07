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
    exit 1
  fi
  echo "$2: $version_output"
  echo
}

# Check for Node.js and npm installation
check_command node "Node.js and npm"

# Check for Python installation
check_command python3 "Python 3"

# Check for C compiler (GCC)
check_command gcc "GCC (C compiler)"

# Check for C++ compiler (G++)
check_command g++ "G++ (C++ compiler)"

# Check for Java installation
check_command java "Java"

# Create admin user
echo "-> Creating admin user..."
node ./create_admin.js
echo

echo "-> Startup script completed."