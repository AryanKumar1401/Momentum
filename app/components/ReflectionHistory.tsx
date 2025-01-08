import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

interface ReflectionHistoryProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReflectionHistory({ visible, onClose }: ReflectionHistoryProps) {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    if (visible) {
      loadReflections();
    }
  }, [visible]);

  const loadReflections = async () => {
    try {
      // Replace with actual user ID from your auth system
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const data = await api.getReflections(userId);
      setReflections(data);
    } catch (error) {
      console.error('Error loading reflections:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reflection History</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={reflections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reflectionItem}>
              <Text style={styles.date}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
              <Text style={styles.label}>Successes:</Text>
              <Text style={styles.text}>{item.success}</Text>
              <Text style={styles.label}>Improvements:</Text>
              <Text style={styles.text}>{item.improvement}</Text>
              <Text style={styles.label}>Additional Notes:</Text>
              <Text style={styles.text}>{item.journal}</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  reflectionItem: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  text: {
    fontSize: 16,
    marginTop: 4,
  },
});