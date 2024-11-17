# Use the official GCC image
FROM gcc:latest

# Set working directory
WORKDIR /usr/src/app

# Default command to compile and run the C++ code
CMD ["g++"]
