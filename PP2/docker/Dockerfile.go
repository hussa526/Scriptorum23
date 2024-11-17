# Use the official Go image
FROM golang:1.19

# Set working directory
WORKDIR /usr/src/app

# Copy Go code into the container
COPY . .

# Default command to run Go code
CMD ["go", "run", "main.go"]
