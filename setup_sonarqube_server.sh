#!/bin/bash

# Setup Local SonarQube Server (Community Edition)
# Usage: ./setup_sonarqube_server.sh

SONAR_VERSION="10.3.0.82913"
SONAR_ZIP="sonarqube-${SONAR_VERSION}.zip"
DOWNLOAD_URL="https://binaries.sonarsource.com/Distribution/sonarqube/${SONAR_ZIP}"
INSTALL_DIR="sonarqube_server"

echo "🚀 Starting SonarQube Setup..."

# Check if Java 17+ is installed (Required for SonarQube 10.x)
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. SonarQube requires Java 17+."
    echo "👉 Please run: brew install openjdk@17"
    exit 1
fi

# Create install directory
if [ -d "$INSTALL_DIR" ]; then
    echo "⚠️  Directory $INSTALL_DIR already exists. Skipping download."
else
    echo "⬇️  Downloading SonarQube Community Edition..."
    curl -L -o "$SONAR_ZIP" "$DOWNLOAD_URL"
    
    echo "📦 Unzipping..."
    unzip -q "$SONAR_ZIP"
    mv "sonarqube-${SONAR_VERSION}" "$INSTALL_DIR"
    rm "$SONAR_ZIP"
    echo "✅ Installed to ./$INSTALL_DIR"
fi

# Create launch script
echo "#!/bin/bash" > start_sonar.sh
echo "./$INSTALL_DIR/bin/macosx-universal-64/sonar.sh start" >> start_sonar.sh
echo "tail -f ./$INSTALL_DIR/logs/sonar.log" >> start_sonar.sh
chmod +x start_sonar.sh

echo "🎉 Setup Complete!"
echo "👉 Run './start_sonar.sh' to start the server."
echo "👉 Then open http://localhost:9000 (Login: admin / admin)"
