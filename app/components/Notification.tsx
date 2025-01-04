import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error';
  onHide: () => void;
}

const Notification = ({ message, type = 'success', onHide }: NotificationProps) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] },
        type === 'error' && styles.errorContainer
      ]}
    >
      <Ionicons 
        name={type === 'success' ? 'checkmark-circle' : 'alert-circle'} 
        size={24} 
        color="#FFF" 
      />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1000,
  },
  errorContainer: {
    backgroundColor: '#FF3B30',
  },
  message: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Notification;
