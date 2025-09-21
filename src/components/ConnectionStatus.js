import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConnectionStatus = ({ isConnected, isConnecting, deviceName, onConnect, onDisconnect }) => {
  const handlePress = () => {
    if (isConnected) {
      onDisconnect();
    } else {
      onConnect();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.connectButton, 
          { backgroundColor: isConnected ? '#FF6B6B' : '#1E3A5F' }
        ]}
        onPress={handlePress}
        disabled={isConnecting}
      >
        <Text style={styles.connectButtonText}>
          {isConnecting 
            ? 'CONNECTING...' 
            : isConnected 
              ? 'DISCONNECT' 
              : 'CONNECT TO U-ARM'
          }
        </Text>
      </TouchableOpacity>
      
      <View style={styles.statusRow}>
        <View style={[
          styles.statusDot, 
          { backgroundColor: isConnected ? '#00FF00' : '#FF0000' }
        ]} />
        <Text style={styles.statusText}>
          {isConnected ? `Connected: ${deviceName}` : 'Disconnected'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  connectButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ConnectionStatus;