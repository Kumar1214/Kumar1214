#!/bin/bash

# Define installation paths
SDK_ROOT="$HOME/Library/Android/sdk"
CMD_TOOLS_DIR="$SDK_ROOT/cmdline-tools"
CMD_TOOLS_LATEST="$CMD_TOOLS_DIR/latest"
DL_DIR="$HOME/Downloads"
CMD_TOOLS_ZIP="$DL_DIR/commandlinetools-mac-11076708_latest.zip"

echo "🚀 Starting Android SDK Command Line Tools Installation..."

# Create directory structure
mkdir -p "$SDK_ROOT"
mkdir -p "$CMD_TOOLS_DIR"

if [ -d "$CMD_TOOLS_LATEST" ]; then
    echo "✅ Android Command Line Tools already installed at $CMD_TOOLS_LATEST"
else
    echo "⬇️ Downloading Command Line Tools..."
    # Download URL for Mac Command Line Tools (latest stable)
    curl -o "$CMD_TOOLS_ZIP" https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip

    echo "📦 Extracting..."
    unzip -q "$CMD_TOOLS_ZIP" -d "$CMD_TOOLS_DIR"

    # Rename extracted 'cmdline-tools' to 'latest' as required by SDK structure
    # The zip typically extracts a folder named 'cmdline-tools'
    if [ -d "$CMD_TOOLS_DIR/cmdline-tools" ]; then
        mv "$CMD_TOOLS_DIR/cmdline-tools" "$CMD_TOOLS_LATEST"
    else
         # Fallback if structure is different
        echo "⚠️  Unexpected zip structure. Please check $CMD_TOOLS_DIR"
        exit 1
    fi
    
    echo "🧹 Cleaning up..."
    rm "$CMD_TOOLS_ZIP"
fi

# Set environment variables for this session
export ANDROID_HOME="$SDK_ROOT"
export PATH="$CMD_TOOLS_LATEST/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "✅ Environment variables set."

# Accept Licenses
echo "📝 Accepting Licenses..."
yes | "$CMD_TOOLS_LATEST/bin/sdkmanager" --licenses --sdk_root="$ANDROID_HOME"

# Install Platform Tools and specific SDK Platform
echo "⬇️ Installing Platform Tools & Android 34 (Upside Down Cake)..."
"$CMD_TOOLS_LATEST/bin/sdkmanager" "platform-tools" "platforms;android-34" "build-tools;34.0.0" --sdk_root="$ANDROID_HOME"

echo "🎉 Android SDK Installation Complete!"
echo "📍 SDK Location: $ANDROID_HOME"
