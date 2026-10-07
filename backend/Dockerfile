# ==========================================
# JobProof Backend - Multi-stage Dockerfile
# ==========================================

# 1. Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

# Cache dependency layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compile and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# 2. Runtime Stage
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Install curl/wget for health checking
RUN apk add --no-cache curl wget

# Create non-root application user for container security
RUN addgroup -S jobproof && adduser -S jobproof -G jobproof
USER jobproof

# Copy built artifact from builder stage
COPY --from=builder --chown=jobproof:jobproof /workspace/target/*.jar app.jar

# Configuration environment defaults
ENV SERVER_PORT=8081 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

EXPOSE 8081

# Docker Healthcheck targeting Spring Boot Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
