# Use the official Perl image
FROM perl:latest

# Set working directory
WORKDIR /usr/src/app

# Default command to run Perl script
CMD ["perl"]
