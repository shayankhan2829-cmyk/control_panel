# 🚀 U-ARM Control Panel - Complete Setup Instructions

## 📂 **What You Have**

This folder contains a **complete React Native mobile app** for U-ARM Control Panel with BLE connectivity to ESP32. No web browser or HTTPS required!

## 🛠️ **Prerequisites Installation**

### **Step 1: Install Java JDK 11**
```powershell
# Download and install OpenJDK 11
# Go to: https://adoptium.net/temurin/releases/?version=11
# Download: OpenJDK 11 (LTS) for Windows x64
# Install with default settings

# After installation, set environment variables:
# Windows Key + R → sysdm.cpl → Advanced → Environment Variables
# Add New System Variable:
#   Variable Name: JAVA_HOME
#   Variable Value: C:\Program Files\Eclipse Adoptium\jdk-11.0.21.9-hotspot
# Edit System Variable PATH, add:
#   %JAVA_HOME%\bin
```

### **Step 2: Install Android Studio**
```powershell
# Download Android Studio from: https://developer.android.com/studio
# Install with default settings
# During setup, make sure to install:
#   - Android SDK Platform 33
#   - Android SDK Build-Tools 33.0.0
#   - Android SDK Platform-Tools
#   - Android Virtual Device (AVD)
```

### **Step 3: Set Android Environment Variables**
```powershell
# Add to System Environment Variables:
# Variable Name: ANDROID_HOME
# Variable Value: C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Edit PATH variable, add these entries:
#   %ANDROID_HOME%\platform-tools
#   %ANDROID_HOME%\tools
#   %ANDROID_HOME%\tools\bin
```

### **Step 4: Install Node.js**
```powershell
# Download Node.js LTS from: https://nodejs.org
# Install version 18 or higher
# Verify installation:
node --version
npm --version
```

## 🔄 **Restart Your Computer**
**Important**: After installing all software and setting environment variables, restart your computer for changes to take effect.

## 📱 **Android Device Setup**

### **Option A: Android Emulator (Recommended)**
1. Open Android Studio
2. Click **Tools → AVD Manager**
3. Click **Create Virtual Device**
4. Select **Phone → Pixel 4** (or similar)
5. Click **Next**
6. Download **Android 13 (API 33)** system image
7. Click **Next → Finish**
8. Click **▶️ Play** button to start emulator

### **Option B: Physical Android Device**
1. On your Android phone:
   - Go to **Settings → About Phone**
   - Tap **Build Number** 7 times (enables Developer Options)
   - Go to **Settings → Developer Options**
   - Enable **USB Debugging**
2. Connect phone to computer via USB cable
3. Allow USB debugging when prompted on phone

## 🚀 **Running the U-ARM App**

### **Step 1: Open Command Prompt/PowerShell**
```powershell
# Navigate to the project folder
cd "C:\Users\Shayan\Downloads\mobile_App4\native_app\UARMControlPanel"
```

### **Step 2: Verify Environment Setup**
```powershell
# Check Java installation
java -version
# Should show: openjdk version "11.0.x"

# Check Android tools
adb version
# Should show: Android Debug Bridge version

# Check Node.js
node --version
npm --version

# Check React Native environment
npx react-native doctor
# Should show mostly green checkmarks
```

### **Step 3: Install Dependencies**
```powershell
# Install all required packages
npm install

# For iOS (if you plan to use iOS later)
# cd ios && pod install && cd ..
```

### **Step 4: Start the App**
```powershell
# Option A: Start Metro bundler in background
npm start

# Then in a NEW command prompt window:
cd "C:\Users\Shayan\Downloads\mobile_App4\native_app\UARMControlPanel"
npx react-native run-android

# Option B: Direct run (starts Metro automatically)
npx react-native run-android
```

## ✅ **Expected Results**

### **Successful Launch:**
1. **Metro bundler starts** (JavaScript packager)
2. **App builds** and installs on device/emulator
3. **U-ARM Control Panel opens** with blue gradient background
4. **"Connect to U-ARM" button** is visible
5. **Motor control buttons** (A1, A2, A3, B1, B2, B3) are displayed

### **App Functionality:**
1. Tap **"Connect to U-ARM"** button
2. **Permission dialogs** appear (grant Bluetooth & Location permissions)
3. App **scans for ESP32** device named "U-ARM"
4. When connected: button shows **"Connected to U-ARM"**
5. **Motor buttons become active** (darker blue when disconnected)
6. Tapping motor buttons **sends BLE commands** to ESP32

## 🔧 **ESP32 Configuration**

Your ESP32 should be programmed with:
```cpp
// BLE Service UUID (must match app)
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "87654321-4321-4321-4321-cba987654321"
#define DEVICE_NAME "U-ARM"

// App sends these commands:
// A1 = Motor A Up
// A2 = Motor A Rotate  
// A3 = Motor A Down
// B1 = Motor B Up
// B2 = Motor B Rotate
// B3 = Motor B Down
```

## 🐛 **Troubleshooting**

### **Build Fails with Java Error:**
```powershell
# Check Java installation
where java
echo $env:JAVA_HOME

# If not set, install JDK 11 and set JAVA_HOME
```

### **"adb not recognized" Error:**
```powershell
# Check Android SDK installation
where adb
echo $env:ANDROID_HOME

# If not found, install Android Studio and set ANDROID_HOME
```

### **"No emulators found" Error:**
```powershell
# List available emulators
emulator -list-avds

# If none found, create one in Android Studio AVD Manager
```

### **Metro bundler issues:**
```powershell
# Clear cache and restart
npx react-native clean
npm start -- --reset-cache
```

### **App crashes on device:**
```powershell
# Check device logs
adb logcat | grep -i "uarm\|bluetooth\|ble"
```

## 📦 **Building APK for Distribution**

### **Debug APK (for testing):**
```powershell
cd android
./gradlew assembleDebug
# APK location: android\app\build\outputs\apk\debug\app-debug.apk
```

### **Release APK (for distribution):**
```powershell
cd android
./gradlew assembleRelease
# APK location: android\app\build\outputs\apk\release\app-release.apk
```

## 🎯 **Command Summary**

**Complete setup and run sequence:**
```powershell
# 1. Navigate to project
cd "C:\Users\Shayan\Downloads\mobile_App4\native_app\UARMControlPanel"

# 2. Install dependencies
npm install

# 3. Start Android emulator (or connect phone)
# (Use Android Studio AVD Manager)

# 4. Run the app
npx react-native run-android
```

## 📞 **Quick Help**

**Minimum requirements to run this app:**
- ✅ Java JDK 11 installed
- ✅ Android Studio with SDK installed  
- ✅ Android emulator running OR phone connected
- ✅ Node.js installed
- ✅ Environment variables set (JAVA_HOME, ANDROID_HOME)

**Time estimate:** 30-60 minutes for first-time setup, 2 minutes for subsequent runs.

**Final result:** Professional native mobile app that connects directly to ESP32 via Bluetooth with pixel-perfect UI matching your design! 🚀