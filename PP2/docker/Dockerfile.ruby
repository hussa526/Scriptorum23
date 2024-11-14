# Use the official Ruby image
FROM ruby:3.0

# Set working directory
WORKDIR /usr/src/app

# Copy Ruby code into the container
COPY . .

# Default command to run Ruby code
CMD ["ruby", "script.rb"]
