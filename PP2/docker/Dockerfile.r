# Use the official Rocker R image
FROM rocker/r-ver:4.1.0

# Set working directory
WORKDIR /usr/src/app

# Default command to run R script
CMD ["Rscript"]
