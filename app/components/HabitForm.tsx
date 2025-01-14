import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CATEGORY_COLORS : any = {
  Health: '#FF6B6B',
  Learning: '#4ECDC4',
  Mindfulness: '#45B7D1',
  Productivity: '#96CEB4',
  Other: '#FFEEAD'
} as const;

const CATEGORIES = Object.keys(CATEGORY_COLORS);

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (habit: {
    name: string;
    category: string;
    cue: string;
    reward: string;
    frequency: string;
  }) => void;
  initialValues?: {
    name: string;
    category: string;
    cue: string;
    reward: string;
    frequency: string;
  };
}

const STEPS = ['Cue', 'Action', 'Reward', 'Frequency'];
const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];

const HabitForm: React.FC<HabitFormProps> = ({ visible, onClose, onSubmit, initialValues }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [cue, setCue] = useState('');
  const [reward, setReward] = useState('');
  const [frequency, setFrequency] = useState('Daily');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setCategory(initialValues.category);
      setCue(initialValues.cue);
      setReward(initialValues.reward);
      setFrequency(initialValues.frequency);
    } else {
      // Reset form when not editing
      setName('');
      setCategory('Other');
      setCue('');
      setReward('');
      setFrequency('Daily');
    }
  }, [initialValues, visible]);

  const handleSubmit = () => {
    if (name.trim() && cue.trim() && reward.trim()) {
      onSubmit({ name, category, cue, reward, frequency });
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setName('');
    setCategory(CATEGORIES[0]);
    setCue('');
    setReward('');
    setFrequency(FREQUENCIES[0]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Cue
        return (
          <View>
            <Text style={styles.stepTitle}>Choose a Trigger</Text>
            <TextInput
              style={styles.input}
              placeholder="What will trigger this habit? (time/location/action)"
              value={cue}
              onChangeText={setCue}
            />
          </View>
        );
      case 1: // Action
        return (
          <View>
            <Text style={styles.stepTitle}>Describe the Habit</Text>
            <TextInput
              style={styles.input}
              placeholder="What habit do you want to form?"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && { backgroundColor: CATEGORY_COLORS[cat] }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryText,
                    category === cat && styles.selectedCategoryText
                  ]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2: // Reward
        return (
          <View>
            <Text style={styles.stepTitle}>Add a Reward</Text>
            <TextInput
              style={styles.input}
              placeholder="What's your reward for completing this habit?"
              value={reward}
              onChangeText={setReward}
            />
          </View>
        );
      case 3: // Frequency
        return (
          <View>
            <Text style={styles.stepTitle}>Set Frequency</Text>
            <View style={styles.frequencyContainer}>
              {FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    frequency === freq && styles.selectedFrequency
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[
                    styles.frequencyText,
                    frequency === freq && styles.selectedFrequencyText
                  ]}>{freq}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Step {currentStep + 1}: {STEPS[currentStep]}</Text>
          
          {renderStep()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                if (currentStep === 0) {
                  resetForm();
                  onClose();
                } else {
                  setCurrentStep(prev => prev - 1);
                }
              }}
            >
              <Text style={styles.buttonText}>
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => {
                if (currentStep === STEPS.length - 1) {
                  handleSubmit();
                  onClose();
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {currentStep === STEPS.length - 1 ? 'Create Habit' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButtonText: {
    color: '#FFF',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  selectedFrequency: {
    backgroundColor: '#007AFF',
  },
  frequencyText: {
    color: '#666',
  },
  selectedFrequencyText: {
    color: '#FFF',
  },
});

export default HabitForm;