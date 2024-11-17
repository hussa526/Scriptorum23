# Use the official OpenJDK image
FROM openjdk:17

# Set working directory
WORKDIR /usr/src/app

# Copy Java source files into the container
COPY . .

# Compile Java code
RUN javac Main.java

# Default command to run the Java program
CMD ["java", "Main"]
