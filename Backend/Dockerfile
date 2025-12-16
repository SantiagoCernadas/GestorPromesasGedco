FROM eclipse-temurin:17-jdk-alpine
ARG JAR_FILE=target/Backend-0.0.1.jar
COPY ${JAR_FILE} app_crm_pps.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app_crm_pps.jar"]