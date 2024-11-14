# Use the official GCC image
FROM gcc:latest

# Set working directory
WORKDIR /usr/src/app

# Copy C source files into the container
COPY . .

# Default command to compile and run the C code
CMD ["gcc", "main.c", "-o", "main", "&&", "./main"]
