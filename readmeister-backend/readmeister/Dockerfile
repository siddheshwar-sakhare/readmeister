# Use official OpenJDK image
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy Maven wrapper & config
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .

# Copy project source
COPY readmeister ./readmeister

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose application port
EXPOSE 1001

# Run the generated jar
CMD ["java", "-jar", "readmeister/target/readmeister-0.0.1-SNAPSHOT.jar"]
