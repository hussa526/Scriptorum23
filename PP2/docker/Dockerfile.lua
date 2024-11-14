# Use the official Lua image
FROM lua:5.1

# Set working directory
WORKDIR /usr/src/app

# Copy Lua code into the container
COPY . .

# Default command to run Lua script
CMD ["lua", "script.lua"]
