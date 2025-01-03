import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Reflection } from '../types/reflection';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReflectionHistoryProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReflectionHistory({ visible, onClose }: ReflectionHistoryProps) {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    loadReflections();
  }, [visible]);

  const loadReflections = async () => {
    try {
      const stored = await AsyncStorage.getItem('reflections');
      if (stored) {
        setReflections(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reflections:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Past Reflections</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reflections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reflectionCard}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              <Text style={styles.label}>Successes:</Text>
              <Text style={styles.content}>{item.successes}</Text>
              <Text style={styles.label}>Improvements:</Text>
              <Text style={styles.content}>{item.improvements}</Text>
              <Text style={styles.label}>Journal:</Text>
              <Text style={styles.content}>{item.journal}</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  reflectionCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  content: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  }
});