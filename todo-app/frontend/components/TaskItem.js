import React from 'react';
import { List, IconButton } from 'react-native-paper';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <List.Item
      title={task.title}
      titleStyle={{
        textDecorationLine: task.completed ? 'line-through' : 'none',
      }}
      left={() => (
        <IconButton
          icon={task.completed ? 'check-circle' : 'circle-outline'}
          onPress={() => onToggle(task)}
        />
      )}
      right={() => (
        <>
          <IconButton icon="pencil" onPress={() => onEdit(task)} />
          <IconButton icon="delete" onPress={() => onDelete(task.id)} />
        </>
      )}
    />
  );
}
