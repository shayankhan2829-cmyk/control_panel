import { BleManager, Device } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

class RealBLEService {
  constructor() {
    this.bleManager = new BleManager();
    this.connectedDevice = null;
    this.serviceUUID = '12345678-1234-1234-1234-123456789abc'; // Default ESP32 service UUID
    this.characteristicUUID = '87654321-4321-4321-4321-cba987654321'; // Default ESP32 characteristic UUID
    this.deviceName = '';
    this.scanning = false;
    this.bluetoothStateSubscription = null;
    
    // Monitor Bluetooth state changes
    this.setupBluetoothStateMonitoring();
  }

  setupBluetoothStateMonitoring() {
    this.bluetoothStateSubscription = this.bleManager.onStateChange((state) => {
      console.log('Bluetooth state changed to:', state);
      if (state === 'PoweredOff') {
        if (this.connectedDevice) {
          console.log('Bluetooth turned off, disconnecting device');
          this.connectedDevice = null;
          this.deviceName = '';
        }
        if (this.scanning) {
          console.log('Bluetooth turned off, stopping scan');
          this.scanning = false;
        }
      }
    }, true);
  }

  async initialize() {
    try {
      // Request Bluetooth permissions for Android
      if (Platform.OS === 'android') {
        const granted = await this.requestBluetoothPermissions();
        if (!granted) {
          Alert.alert(
            'Permissions Required', 
            'Bluetooth permissions are required to use this app. Please grant permissions in Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
      }

      // Check if Bluetooth is enabled
      const state = await this.bleManager.state();
      console.log('Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        return await this.handleBluetoothDisabled(state);
      }

      return true;
    } catch (error) {
      console.error('BLE initialization error:', error);
      return false;
    }
  }

  async handleBluetoothDisabled(state) {
    let message = 'Bluetooth is required to connect to your U-ARM device.';
    let title = 'Bluetooth Required';
    
    switch (state) {
      case 'PoweredOff':
        message = 'Bluetooth is turned off. Please enable Bluetooth to connect to your U-ARM device.';
        title = 'Enable Bluetooth';
        break;
      case 'Unauthorized':
        message = 'Bluetooth permission is not granted. Please allow Bluetooth access in Settings.';
        title = 'Bluetooth Permission Required';
        break;
      case 'Unsupported':
        message = 'Bluetooth Low Energy is not supported on this device.';
        title = 'Bluetooth Not Supported';
        break;
      case 'Unknown':
        message = 'Bluetooth state is unknown. Please check your device settings.';
        title = 'Bluetooth Issue';
        break;
      default:
        message = `Bluetooth is not ready (State: ${state}). Please ensure Bluetooth is enabled.`;
    }

    return new Promise((resolve) => {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { 
            text: 'Open Settings', 
            onPress: () => {
              if (Platform.OS === 'android') {
                // Try to open Bluetooth settings directly
                Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS').catch(() => {
                  // Fallback to general settings
                  Linking.openSettings();
                });
              } else {
                Linking.openSettings();
              }
              resolve(false);
            }
          },
          {
            text: 'Retry',
            onPress: async () => {
              // Check Bluetooth state again
              const newState = await this.bleManager.state();
              if (newState === 'PoweredOn') {
                resolve(true);
              } else {
                resolve(await this.handleBluetoothDisabled(newState));
              }
            }
          }
        ]
      );
    });
  }

  async requestBluetoothPermissions() {
    try {
      if (Platform.Version >= 31) {
        // Android 12+ permissions
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        
        return (
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'granted' &&
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'granted' &&
          result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted'
        );
      } else {
        // Pre-Android 12 permissions
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        
        return (
          result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' &&
          result[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted'
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  async scanForDevices(onDeviceFound) {
    try {
      // Check Bluetooth state before scanning
      const state = await this.bleManager.state();
      if (state !== 'PoweredOn') {
        const initialized = await this.handleBluetoothDisabled(state);
        if (!initialized) {
          throw new Error('Bluetooth is not enabled');
        }
      }

      this.scanning = true;
      
      // Stop any existing scan
      await this.bleManager.stopDeviceScan();
      
      console.log('Starting BLE scan for ESP devices...');
      
      this.bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          this.scanning = false;
          return;
        }

        if (device && device.name) {
          console.log('Found device:', device.name, device.id);
          
          // Look for ESP devices or devices with U-ARM in the name
          const deviceName = device.name.toLowerCase();
          if (deviceName.includes('esp') || 
              deviceName.includes('u-arm') || 
              deviceName.includes('uarm') ||
              deviceName.includes('arduino') ||
              deviceName.includes('bluetooth')) {
            
            console.log('ESP/U-ARM device found:', device.name);
            this.bleManager.stopDeviceScan();
            this.scanning = false;
            onDeviceFound(device);
          }
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        if (this.scanning) {
          this.bleManager.stopDeviceScan();
          this.scanning = false;
          console.log('Scan timeout - no devices found');
        }
      }, 10000);

    } catch (error) {
      console.error('Scan error:', error);
      this.scanning = false;
      throw error;
    }
  }

  // Add cleanup method
  destroy() {
    if (this.bluetoothStateSubscription) {
      this.bluetoothStateSubscription.remove();
    }
    if (this.connectedDevice) {
      this.connectedDevice.cancelConnection().catch(console.error);
    }
    this.bleManager.destroy();
  }

  async connectToDevice(device) {
    try {
      console.log('Connecting to device:', device.name);
      
      // Connect to the device
      this.connectedDevice = await this.bleManager.connectToDevice(device.id);
      this.deviceName = device.name;
      
      console.log('Connected to:', device.name);
      
      // Discover services and characteristics
      await this.connectedDevice.discoverAllServicesAndCharacteristics();
      
      console.log('Services and characteristics discovered');
      
      // Setup disconnection listener
      this.connectedDevice.onDisconnected((error, device) => {
        console.log('Device disconnected:', device.id);
        this.connectedDevice = null;
        this.deviceName = '';
      });

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      this.connectedDevice = null;
      this.deviceName = '';
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connectedDevice) {
        await this.connectedDevice.cancelConnection();
        this.connectedDevice = null;
        this.deviceName = '';
        console.log('Device disconnected successfully');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  async sendCommand(command) {
    try {
      if (!this.connectedDevice) {
        throw new Error('No device connected');
      }

      console.log('Sending command:', command);
      
      // Convert command to base64 for transmission
      const commandData = Buffer.from(command, 'utf8').toString('base64');
      
      // Try to find a writable characteristic
      const services = await this.connectedDevice.services();
      
      for (const service of services) {
        const characteristics = await service.characteristics();
        
        for (const characteristic of characteristics) {
          // Look for writable characteristics
          if (characteristic.isWritableWithResponse || characteristic.isWritableWithoutResponse) {
            try {
              await characteristic.writeWithResponse(commandData);
              console.log('Command sent successfully:', command);
              return true;
            } catch (writeError) {
              // Try next characteristic if this one fails
              console.log('Failed to write to characteristic:', characteristic.uuid);
            }
          }
        }
      }
      
      // If no writable characteristic found, try default UUIDs
      try {
        await this.connectedDevice.writeCharacteristicWithResponseForService(
          this.serviceUUID,
          this.characteristicUUID,
          commandData
        );
        console.log('Command sent via default UUID:', command);
        return true;
      } catch (defaultError) {
        console.error('Failed to send command via default UUID:', defaultError);
        throw new Error('Unable to send command - no writable characteristic found');
      }

    } catch (error) {
      console.error('Send command error:', error);
      throw error;
    }
  }

  isConnected() {
    return this.connectedDevice !== null;
  }

  getConnectedDeviceName() {
    return this.deviceName || 'Unknown Device';
  }

  // Method to set custom service and characteristic UUIDs for different ESP configurations
  setCustomUUIDs(serviceUUID, characteristicUUID) {
    this.serviceUUID = serviceUUID;
    this.characteristicUUID = characteristicUUID;
  }

  // Method to get device info for configuration
  async getDeviceInfo() {
    if (!this.connectedDevice) {
      return null;
    }

    try {
      const services = await this.connectedDevice.services();
      const deviceInfo = {
        name: this.deviceName,
        id: this.connectedDevice.id,
        services: []
      };

      for (const service of services) {
        const characteristics = await service.characteristics();
        deviceInfo.services.push({
          uuid: service.uuid,
          characteristics: characteristics.map(char => ({
            uuid: char.uuid,
            isReadable: char.isReadable,
            isWritableWithResponse: char.isWritableWithResponse,
            isWritableWithoutResponse: char.isWritableWithoutResponse,
          }))
        });
      }

      return deviceInfo;
    } catch (error) {
      console.error('Get device info error:', error);
      return null;
    }
  }
}

// Export a singleton instance
export default new RealBLEService();