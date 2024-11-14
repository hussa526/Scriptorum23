# Use the official PHP image
FROM php:8.0

# Set working directory
WORKDIR /usr/src/app

# Copy PHP code into the container
COPY . .

# Default command to run PHP code
CMD ["php", "index.php"]
