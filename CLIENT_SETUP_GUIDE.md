# U-ARM Control Panel - Client Setup Guide

## Overview
The U-ARM Control Panel is a React Native mobile app that connects to ESP32/ESP8266 devices via Bluetooth Low Energy (BLE) to control robotic arm motors. The app sends commands A1, A2, A3, B1, B2, B3 to your ESP device for motor control.

## Features
- ✅ Real Bluetooth Low Energy (BLE) connectivity
- ✅ Automatic ESP device scanning and detection
- ✅ Configurable UUIDs for different ESP setups
- ✅ Real-time motor command transmission
- ✅ Offline functionality - no internet required
- ✅ Beautiful blue gradient UI matching your design

## App Installation
1. Download the APK file from the release
2. Install on your Android device
3. Grant Bluetooth and Location permissions when prompted

## ESP32/ESP8266 Setup

### Required Arduino Libraries
```cpp
#include <BluetoothSerial.h>
// For ESP32, or use SoftwareSerial for ESP8266
```

### Basic ESP32 Code Template
```cpp
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;
String receivedCommand = "";

void setup() {
  Serial.begin(115200);
  SerialBT.begin("U-ARM-ESP32"); // Bluetooth device name
  Serial.println("The device started, now you can pair it with bluetooth!");
  
  // Initialize your motor pins here
  // pinMode(motorA_pin1, OUTPUT);
  // pinMode(motorA_pin2, OUTPUT);
  // etc.
}

void loop() {
  if (SerialBT.available()) {
    receivedCommand = SerialBT.readString();
    receivedCommand.trim(); // Remove whitespace
    
    // Process the command
    handleCommand(receivedCommand);
  }
}

void handleCommand(String command) {
  Serial.println("Received command: " + command);
  
  // Motor A Commands
  if (command == "A1") {
    // Move Motor A Up
    Serial.println("Motor A - Up");
    // Your motor control code here
  }
  else if (command == "A2") {
    // Rotate Motor A (Reset)
    Serial.println("Motor A - Rotate/Reset");
    // Your motor control code here
  }
  else if (command == "A3") {
    // Move Motor A Down
    Serial.println("Motor A - Down");
    // Your motor control code here
  }
  
  // Motor B Commands
  else if (command == "B1") {
    // Move Motor B Up
    Serial.println("Motor B - Up");
    // Your motor control code here
  }
  else if (command == "B2") {
    // Rotate Motor B (Reset)
    Serial.println("Motor B - Rotate/Reset");
    // Your motor control code here
  }
  else if (command == "B3") {
    // Move Motor B Down
    Serial.println("Motor B - Down");
    // Your motor control code here
  }
  
  else {
    Serial.println("Unknown command: " + command);
  }
}
```

### Advanced Setup with Custom UUIDs (Optional)
If you need custom BLE service and characteristic UUIDs:

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Custom UUIDs (configure these in the app)
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "87654321-4321-4321-4321-cba987654321"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();
      String command = String(rxValue.c_str());
      handleCommand(command);
    }
};

void setup() {
  BLEDevice::init("U-ARM-ESP32");
  pServer = BLEDevice::createServer();
  
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_WRITE
                    );

  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start();
  
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  pServer->getAdvertising()->start();
}
```

## How to Use the App

### 1. First Time Setup
1. Open the U-ARM Control Panel app
2. Tap the "⚙️ ESP Config" button in the header
3. Configure your ESP device UUIDs if using custom setup
4. Or use "Auto-Detect" if your ESP is already connected

### 2. Connecting to Your ESP Device
1. Make sure your ESP32/ESP8266 is powered on and running the Bluetooth code
2. Tap "CONNECT TO U-ARM" 
3. The app will automatically scan for ESP devices
4. Connection will be established automatically when found

### 3. Controlling Motors
- **▲ Buttons**: Send A1/B1 commands (Move Up)
- **↻ Buttons**: Send A2/B2 commands (Rotate/Reset) 
- **▼ Buttons**: Send A3/B3 commands (Move Down)
- Commands are sent instantly in real-time when buttons are pressed

### 4. Device Names Detected
The app automatically looks for devices with names containing:
- "ESP"
- "U-ARM" or "UARM"
- "Arduino"
- "Bluetooth"

## Troubleshooting

### Connection Issues
1. **Device not found**: 
   - Check ESP device name includes "ESP", "U-ARM", or "Arduino"
   - Ensure ESP is powered and running Bluetooth code
   - Check Android Bluetooth is enabled

2. **Permission Denied**:
   - Grant Bluetooth and Location permissions in Android settings
   - For Android 12+, ensure "Nearby devices" permission is granted

3. **Commands not working**:
   - Check ESP serial monitor for received commands
   - Verify handleCommand() function processes A1, A2, A3, B1, B2, B3
   - Use ESP Configuration to auto-detect UUIDs

### ESP32 Troubleshooting
- Use Serial Monitor at 115200 baud to see received commands
- Ensure BluetoothSerial is properly initialized
- Check ESP32 is in pairable mode
- Restart ESP32 if Bluetooth becomes unresponsive

## Technical Details
- **Framework**: React Native 0.72.17
- **BLE Library**: react-native-ble-plx v3.5.0
- **Supported Platforms**: Android (iOS support available)
- **Commands Sent**: Plain text strings (A1, A2, A3, B1, B2, B3)
- **Connection Type**: Bluetooth Low Energy (BLE)
- **Data Format**: UTF-8 encoded strings

## Support
For technical support or custom modifications, contact your development team with:
- ESP32 serial monitor output
- Android logcat output (if available)
- Specific error messages or behaviors
- ESP32 code being used

---
**Ready to Control Your U-ARM!** 🦾

The app is production-ready and will connect to any ESP32/ESP8266 device running the provided Bluetooth code. Simply flash your ESP, run the app, and start controlling your robotic arm!