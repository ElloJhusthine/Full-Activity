import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { Provider as PaperProvider, Button, DefaultTheme, DarkTheme } from 'react-native-paper';
import TaskItem from './components/TaskItem';
import api from './utils/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('All'); // All, Completed, Pending
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask.id}/`, { title });
        setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
        setEditingTask(null);
      } else {
        const response = await api.post('/tasks/', { title });
        setTasks([...tasks, response.data]);
      }
      setTitle('');
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await api.put(`/tasks/${task.id}/`, {
        ...task,
        completed: !task.completed,
      });
      setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditingTask(task);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return true;
  });

  return (
    <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#E6E6FA' }]}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#800080', borderColor: '#800080' }]}
          placeholder="Enter task"
          placeholderTextColor={isDarkMode ? '#aaa' : '#800080'}
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>{editingTask ? 'Update Task' : 'Add Task'}</Text>
        </TouchableOpacity>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['All', 'Completed', 'Pending'].map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => setFilter(option)}
              style={[
                styles.filterButton,
                filter === option && styles.activeFilter,
              ]}
            >
              <Text style={styles.filterText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dark Mode Toggle */}
        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsDarkMode(!isDarkMode)}>
          <Text style={styles.buttonText}>
            {isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#E6E6FA',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#D8BFD8',
    padding: 8,
    borderRadius: 5,
  },
  activeFilter: {
    backgroundColor: '#BA55D3',
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#9370DB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
});
