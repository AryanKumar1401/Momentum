import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HabitForm from '../components/HabitForm';

// Types for our habit data
interface Habit {
  id: string;
  name: string;
  category: string;
  progress: number;
  streak: number;
  color: string;
  cue: string;
  reward: string;
  frequency: string;
}

const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    category: 'Mindfulness',
    progress: 0.8,
    streak: 5,
    color: '#FF6B6B',
    cue: 'After waking up',
    reward: '5min social media',
    frequency: 'Daily'
  },
  {
    id: '2',
    name: 'Read 30 mins',
    category: 'Learning',
    progress: 0.6,
    streak: 3,
    color: '#4ECDC4',
    cue: 'Before bed',
    reward: 'Watch one episode',
    frequency: 'Daily'
  },
  {
    id: '3',
    name: 'Exercise',
    category: 'Health',
    progress: 0.4,
    streak: 7,
    color: '#45B7D1',
    cue: 'After work',
    reward: 'Healthy snack',
    frequency: 'Weekly'
  },
];

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const toggleHabit = (habitId: string) => {
    setHabits(currentHabits =>
      currentHabits.map(habit =>
        habit.id === habitId
          ? {
            ...habit,
            progress: habit.progress === 1 ? 0 : 1,
            streak: habit.progress === 1 ? habit.streak - 1 : habit.streak + 1
          }
          : habit
      )
    );
  };
  const addHabit = (newHabit: Omit<Habit, 'id' | 'progress' | 'streak'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      progress: 0,
      streak: 0,
    };
    setHabits(currentHabits => [...currentHabits, habit]);
    setShowModal(false);
  };

  const renderHabitCard = (habit: Habit) => (
    <TouchableOpacity
      key={habit.id}
      style={styles.habitCard}
      onPress={() => toggleHabit(habit.id)}
      activeOpacity={0.7}
    >
      <View style={styles.habitHeader}>
        <View style={styles.habitTitleRow}>
          <Ionicons
            name={habit.progress === 1 ? "checkmark-circle" : "checkmark-circle-outline"}
            size={24}
            color={habit.progress === 1 ? habit.color : "#666"}
          />
          <Text style={[
            styles.habitName,
            habit.progress === 1 && styles.completedHabitName
          ]}>
            {habit.name}
          </Text>
        </View>
        <Text style={styles.streak}>🔥 {habit.streak} days</Text>
      </View>

      <View style={styles.habitDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="alarm-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{habit.cue}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="repeat-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{habit.frequency}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="gift-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{habit.reward}</Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: habit.color }]}>
            <Text style={styles.categoryText}>{habit.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Today's Habits</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.habitsList}>
          {habits.map(habit => renderHabitCard(habit))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      <HabitForm
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={addHabit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  habitsList: {
    padding: 20,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  completedHabitName: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  streak: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  habitDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    opacity: 0.8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Index;