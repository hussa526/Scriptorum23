#!/bin/bash

# Run the Next.js build process to create the production build
echo "Building the Next.js application..."
npm run build

# Start the production server
echo "Starting the Next.js production server..."
npm start
