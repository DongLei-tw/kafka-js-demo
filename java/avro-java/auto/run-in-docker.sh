docker run --rm -it \
  -v "$PWD":/app \
  -v "$HOME/.m2":/root/.m2 \
  -w /app \
  maven:3.9.10-eclipse-temurin-11 \
  # sh -c "mvn package -DskipTests && java -cp target/*.jar org.example.Main"
  mvn exec:java -Dexec.mainClass="org.example.Main"
