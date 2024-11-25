# Use the official Go image
FROM golang:1.19

# Set working directory
WORKDIR /usr/src/app

# Default command to run Go code
CMD ["go"]
