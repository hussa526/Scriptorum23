# Use the official Perl image
FROM perl:latest

# Set working directory
WORKDIR /usr/src/app

# Copy Perl code into the container
COPY . .

# Default command to run Perl script
CMD ["perl", "script.pl"]
