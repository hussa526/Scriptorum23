# Use the official Swift image
FROM swift:5.7

# Set working directory
WORKDIR /usr/src/app

# Copy Swift code into the container
COPY . .

# Default command to compile and run Swift code
CMD ["swift", "run", "main.swift"]
