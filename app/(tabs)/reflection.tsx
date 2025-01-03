import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ReflectionHistory from '../components/ReflectionHistory';
import { Reflection } from '../types/reflection';


export default function ReflectionScreen() {
  const [successes, setSuccesses] = useState('');
  const [improvements, setImprovements] = useState('');
  const [journal, setJournal] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSave = async () => {
    console.log('Saving reflection:', { successes, improvements, journal });
    // TODO: Implement actual saving functionality
    if (!successes.trim() || !improvements.trim() || !journal.trim()) {
      Alert.alert('Please fill out all fields');
      return;
    }

    try {
      const newReflection: Reflection = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        successes,
        improvements,
        journal
      };

      const stored = await AsyncStorage.getItem('reflections');
      const reflections = stored ? JSON.parse(stored) : [];
      await AsyncStorage.setItem(
        'reflections',
        JSON.stringify([newReflection, ...reflections])
      );

      setSuccesses('');
      setImprovements('');
      setJournal('');
      Alert.alert('Success', 'Reflection saved successfully!');

    } catch (error) {
      console.error('Error saving reflection:', error);
      Alert.alert('Failed to save reflection');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Daily Reflection</Text>
        <TouchableOpacity
          onPress={() => setShowHistory(true)}
          style={styles.historyButton}
        >
          <Ionicons name="time-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>What went well today?</Text>
          <TextInput
            style={styles.input}
            multiline
            value={successes}
            onChangeText={setSuccesses}
            placeholder="List your wins and accomplishments..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>What could be improved?</Text>
          <TextInput
            style={styles.input}
            multiline
            value={improvements}
            onChangeText={setImprovements}
            placeholder="Areas for growth and improvement..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Journal</Text>
          <TextInput
            style={[styles.input, styles.journalInput]}
            multiline
            value={journal}
            onChangeText={setJournal}
            placeholder="Additional thoughts and reflections..."
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Reflection</Text>
        </TouchableOpacity>
      </ScrollView>

      <ReflectionHistory
        visible={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </KeyboardAvoidingView>
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
  historyButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  journalInput: {
    minHeight: 150,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});