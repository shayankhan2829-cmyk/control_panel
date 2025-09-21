# 🛠️ U-ARM React Native App - Development Setup Guide

## 📋 **System Requirements**

Your React Native app is ready, but you need to set up the development environment. Here's exactly what you need:

## 🔧 **Required Software Installation**

### **1. Java Development Kit (JDK 11)**
Download and install JDK 11:
- **Download**: [Oracle JDK 11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) or [OpenJDK 11](https://adoptium.net/temurin/releases/?version=11)
- **Install**: Run the installer with default settings
- **Set JAVA_HOME**: 
  ```powershell
  # Add to Windows Environment Variables:
  JAVA_HOME = C:\Program Files\Java\jdk-11.0.x
  PATH = %JAVA_HOME%\bin
  ```

### **2. Android Studio**
Download and install Android Studio:
- **Download**: [Android Studio](https://developer.android.com/studio)
- **Install**: Choose "Standard" setup
- **SDK Setup**: Install Android SDK Platform 33, Android SDK Build-Tools, Android SDK Platform-Tools

### **3. Android SDK Configuration**
Set up environment variables:
```powershell
# Add to Windows Environment Variables:
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
PATH = %ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin
```

## 📱 **Device Setup Options**

### **Option A: Android Emulator (Recommended for testing)**
1. Open Android Studio
2. Go to **Tools → AVD Manager**
3. Click **"Create Virtual Device"**
4. Choose **Pixel 4** or similar
5. Download **Android 13 (API 33)** system image
6. Create and start the emulator

### **Option B: Physical Android Device**
1. Enable **Developer Options** on your Android phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. Connect phone via USB cable
4. Allow USB debugging when prompted

## 🚀 **Quick Setup Verification**

After installing everything, restart your command prompt and run:

```powershell
# Verify Java
java -version

# Verify Android tools
adb version

# Check React Native environment
npx react-native doctor
```

## 🏃‍♂️ **Running Your U-ARM App**

Once setup is complete:

```powershell
# Navigate to your app
cd C:\Users\Shayan\Downloads\mobile_App4\native_app\UARMControlPanel

# Start Metro bundler (keep this running)
npm start

# In a NEW terminal, run on Android:
npx react-native run-android
```

## 🎯 **Expected Results**

After successful setup:
1. **App launches** on emulator/device
2. **"Connect to U-ARM" button** appears
3. **Permission dialogs** for Bluetooth/Location
4. **BLE scanning** works when you tap connect
5. **Motor control buttons** send commands to ESP32

## 🔧 **Alternative: APK Build for Testing**

If you want to skip the full development setup and just test the app:

### **Build APK using GitHub Actions** (recommended)
1. Push your code to GitHub
2. Set up GitHub Actions to build APK
3. Download and install APK on your phone

### **Local APK Build** (requires full setup)
```powershell
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/
```

## 🐛 **Common Issues & Solutions**

### **"JAVA_HOME not set"**
- Install JDK 11 and set JAVA_HOME environment variable
- Restart command prompt after setting variables

### **"adb not recognized"**
- Install Android SDK and add platform-tools to PATH
- Restart command prompt

### **"No emulators found"**
- Create Android Virtual Device (AVD) in Android Studio
- Or connect physical Android device with USB debugging

### **Build fails**
- Run: `npx react-native doctor` to check setup
- Clear cache: `npx react-native clean`

## 📞 **Quick Help**

**Fastest way to test your app:**
1. Install only Android Studio (includes JDK)
2. Create Android emulator
3. Run `npx react-native run-android`

**Production deployment:**
- Build APK and share with users
- No development setup required on user devices

Your U-ARM Control Panel app is fully coded and ready - you just need the Android development environment to run it! 🚀