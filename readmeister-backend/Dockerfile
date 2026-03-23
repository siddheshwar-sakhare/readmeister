FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

COPY src ./src

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 1001

CMD ["java", "-jar", "target/readmeister-0.0.1-SNAPSHOT.jar"]