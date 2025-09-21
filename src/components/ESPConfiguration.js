import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import BLEService from '../services/BLEService';

const ESPConfiguration = ({ visible, onClose, onSave }) => {
  const [serviceUUID, setServiceUUID] = useState('12345678-1234-1234-1234-123456789abc');
  const [characteristicUUID, setCharacteristicUUID] = useState('87654321-4321-4321-4321-cba987654321');
  const [deviceInfo, setDeviceInfo] = useState(null);

  const handleSave = () => {
    // Validate UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(serviceUUID)) {
      Alert.alert('Invalid UUID', 'Please enter a valid Service UUID');
      return;
    }
    
    if (!uuidRegex.test(characteristicUUID)) {
      Alert.alert('Invalid UUID', 'Please enter a valid Characteristic UUID');
      return;
    }

    // Save the configuration
    BLEService.setCustomUUIDs(serviceUUID, characteristicUUID);
    
    if (onSave) {
      onSave({ serviceUUID, characteristicUUID });
    }
    
    Alert.alert('Configuration Saved', 'ESP device configuration has been updated');
    onClose();
  };

  const handleDetectConfiguration = async () => {
    try {
      const info = await BLEService.getDeviceInfo();
      if (info) {
        setDeviceInfo(info);
        
        // Auto-fill UUIDs if possible
        if (info.services.length > 0) {
          const service = info.services[0];
          setServiceUUID(service.uuid);
          
          if (service.characteristics.length > 0) {
            // Find first writable characteristic
            const writableChar = service.characteristics.find(
              char => char.isWritableWithResponse || char.isWritableWithoutResponse
            );
            if (writableChar) {
              setCharacteristicUUID(writableChar.uuid);
            }
          }
        }
        
        Alert.alert('Device Detected', 'Configuration detected automatically from connected device');
      } else {
        Alert.alert('No Device', 'Please connect to your ESP device first');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to detect device configuration');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.title}>ESP Device Configuration</Text>
            <Text style={styles.subtitle}>Configure your ESP32/ESP8266 Bluetooth settings</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Service UUID:</Text>
              <TextInput
                style={styles.input}
                value={serviceUUID}
                onChangeText={setServiceUUID}
                placeholder="12345678-1234-1234-1234-123456789abc"
                autoCapitalize="none"
                multiline={false}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Characteristic UUID:</Text>
              <TextInput
                style={styles.input}
                value={characteristicUUID}
                onChangeText={setCharacteristicUUID}
                placeholder="87654321-4321-4321-4321-cba987654321"
                autoCapitalize="none"
                multiline={false}
              />
            </View>
            
            <TouchableOpacity
              style={styles.detectButton}
              onPress={handleDetectConfiguration}
            >
              <Text style={styles.detectButtonText}>Auto-Detect from Connected Device</Text>
            </TouchableOpacity>
            
            {deviceInfo && (
              <View style={styles.deviceInfoContainer}>
                <Text style={styles.deviceInfoTitle}>Connected Device Info:</Text>
                <Text style={styles.deviceInfoText}>Name: {deviceInfo.name}</Text>
                <Text style={styles.deviceInfoText}>Services: {deviceInfo.services.length}</Text>
                {deviceInfo.services.map((service, index) => (
                  <View key={index} style={styles.serviceContainer}>
                    <Text style={styles.serviceText}>Service {index + 1}: {service.uuid}</Text>
                    <Text style={styles.characteristicText}>
                      Characteristics: {service.characteristics.length}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionTitle}>ESP32 Setup Instructions:</Text>
              <Text style={styles.instructionText}>
                1. Flash your ESP32 with Bluetooth Serial code{'\n'}
                2. Use the UUIDs above in your ESP32 code{'\n'}
                3. Make sure your ESP32 is discoverable{'\n'}
                4. Commands A1, A2, A3, B1, B2, B3 will be sent as strings
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Configuration</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#9BB5D6',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  detectButton: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  detectButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deviceInfoContainer: {
    backgroundColor: '#F0F4F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 10,
  },
  deviceInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  serviceContainer: {
    marginLeft: 10,
    marginTop: 5,
  },
  serviceText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'monospace',
  },
  characteristicText: {
    fontSize: 12,
    color: '#777',
  },
  instructionContainer: {
    backgroundColor: '#E8F4F8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95A5A6',
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    paddingVertical: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ESPConfiguration;