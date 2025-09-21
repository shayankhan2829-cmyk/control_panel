import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the consistent dark blue color (copied from ESP Configuration and Connect button)
const BUTTON_COLOR = '#1E3A5F';

const MotorButton = ({ onPress, disabled, color, icon }) => (
  <TouchableOpacity 
    style={[
      styles.motorButton, 
      { backgroundColor: BUTTON_COLOR }
    ]}
    onPress={() => {
      console.log(`Motor button pressed: ${icon}`);
      if (onPress) onPress();
    }}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={styles.iconText}>{icon}</Text>
  </TouchableOpacity>
);

const MotorControl = ({ motorName, onCommand, isConnected }) => {
  const handleCommand = (action, command) => {
    console.log(`MotorControl: ${motorName} - ${action} - ${command}`);
    if (onCommand) {
      onCommand(motorName, action, command);
    } else {
      console.log('No onCommand handler provided');
    }
    
    // Show visual feedback that button was pressed
    console.log(`Button pressed: ${command} - Motor ${motorName} ${action}`);
  };

  const motorCommands = {
    A: { up: 'A1', rotate: 'A2', down: 'A3' },
    B: { up: 'B1', rotate: 'B2', down: 'B3' }
  };

  const commands = motorCommands[motorName];

  return (
    <View style={styles.motorSection}>
      <View style={styles.motorHeader}>
        <Text style={styles.motorTitle}>MOTOR {motorName}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <MotorButton
          onPress={() => handleCommand('up', commands.up)}
          disabled={false}
          color={BUTTON_COLOR}
          icon="▲"
        />
        
        <MotorButton
          onPress={() => handleCommand('rotate', commands.rotate)}
          disabled={false}
          color={BUTTON_COLOR}
          icon="↻"
        />
        
        <MotorButton
          onPress={() => handleCommand('down', commands.down)}
          disabled={false}
          color={BUTTON_COLOR}
          icon="▼"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  motorSection: {
    marginVertical: 15,
  },
  motorHeader: {
    backgroundColor: '#9BB5D6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
  },
  motorTitle: {
    color: BUTTON_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  motorButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  iconText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
});

export default MotorControl;