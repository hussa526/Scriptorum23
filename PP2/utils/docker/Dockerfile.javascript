# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies (if applicable)
# COPY package*.json ./
# RUN npm install

# Expose port (if needed for a web service)
# EXPOSE 8080

# Default command to run Node.js application
CMD ["node", "index.js"]
