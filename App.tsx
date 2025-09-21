import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MotorControl from './src/components/MotorControl';
import ConnectionStatus from './src/components/ConnectionStatus.js';
import ESPConfiguration from './src/components/ESPConfiguration';
import BLEService from './src/services/BLEService';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [showConfiguration, setShowConfiguration] = useState(false);

  useEffect(() => {
    initializeBLE();
  }, []);

  const initializeBLE = async () => {
    try {
      const initialized = await BLEService.initialize();
      if (!initialized) {
        Alert.alert('Error', 'Failed to initialize Bluetooth. Please check permissions.');
      }
    } catch (error) {
      console.error('BLE initialization error:', error);
      Alert.alert('Error', 'Bluetooth initialization failed');
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      await BLEService.scanForDevices((device: any) => {
        connectToDevice(device);
      });
      
      // If no device found after 10 seconds
      setTimeout(() => {
        if (!isConnected) {
          setIsConnecting(false);
          Alert.alert('Device Not Found', 'Could not find U-ARM device. Make sure it\'s powered on and nearby.');
        }
      }, 11000);
      
    } catch (error) {
      setIsConnecting(false);
      Alert.alert('Error', 'Failed to scan for devices');
    }
  };

  const connectToDevice = async (device: any) => {
    try {
      await BLEService.connectToDevice(device);
      setIsConnected(true);
      setIsConnecting(false);
      setDeviceName(BLEService.getConnectedDeviceName());
      Alert.alert('Success', `Connected to ${BLEService.getConnectedDeviceName()}`);
    } catch (error) {
      setIsConnecting(false);
      Alert.alert('Error', 'Failed to connect to device');
    }
  };

  const handleDisconnect = async () => {
    try {
      await BLEService.disconnect();
      setIsConnected(false);
      setDeviceName('');
      Alert.alert('Disconnected', 'Device disconnected successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to disconnect');
    }
  };

  const handleMotorCommand = async (motorLetter: string, action: string, command: string) => {
    try {
      console.log(`Sending command: Motor ${motorLetter} - ${action}: ${command}`);
      await BLEService.sendCommand(command);
      console.log(`Motor ${motorLetter} - ${action}: ${command} sent successfully`);
    } catch (error) {
      console.error('Failed to send command:', error);
      Alert.alert('Error', 'Failed to send command');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Background Gradient Effect */}
      <LinearGradient
        colors={['#4A6CF7', '#7B9BFF', '#A8C5FF']}
        style={styles.backgroundGradient}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>AME</Text>
          <Text style={styles.titleText}>U-ARM</Text>
          <Text style={styles.subtitleText}>CONTROL PANEL</Text>
          
          {/* Configuration Button */}
          <TouchableOpacity 
            style={styles.configButton}
            onPress={() => setShowConfiguration(true)}
          >
            <Text style={styles.configButtonText}>⚙️ ESP Config</Text>
          </TouchableOpacity>
        </View>

        {/* Connection Status */}
        <ConnectionStatus
          isConnected={isConnected}
          isConnecting={isConnecting}
          deviceName={deviceName}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Motor Controls */}
        <View style={styles.motorControlsContainer}>
          <MotorControl
            motorName="A"
            onCommand={handleMotorCommand}
            isConnected={isConnected}
          />
          
          <MotorControl
            motorName="B"
            onCommand={handleMotorCommand}
            isConnected={isConnected}
          />
        </View>
        
        {/* ESP Configuration Modal */}
        <ESPConfiguration
          visible={showConfiguration}
          onClose={() => setShowConfiguration(false)}
          onSave={(config: any) => {
            console.log('ESP Configuration saved:', config);
          }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  backgroundGradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoText: {
    color: '#B8C7FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleText: {
    color: '#E8EEFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitleText: {
    color: '#B8C7FF',
    fontSize: 16,
    letterSpacing: 2,
  },
  configButton: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 15,
  },
  configButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  motorControlsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;