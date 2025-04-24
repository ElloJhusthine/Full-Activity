import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import TaskItem from './components/TaskItem';  // Adjust the path if necessary
import api from './utils/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);

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

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          placeholderTextColor="#800080"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>
            {editingTask ? 'Update Task' : 'Add Task'}
          </Text>
        </TouchableOpacity>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
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
    backgroundColor: '#E6E6FA', // light violet
  },
  input: {
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#800080',
  },
  button: {
    backgroundColor: '#800080', // purple
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#E6E6FA',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
