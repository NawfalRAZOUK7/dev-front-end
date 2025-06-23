// TodoPage.tsx - Page finale utilisant l'architecture complète
import React from 'react';
import { Box, Space } from '@mantine/core';
import TodoApp from '../components/Feature/TodoApp/TodoApp';
import { type Todo } from '../types/todo.types';

/**
 * Props pour la page Todo
 */
interface TodoPageProps {
  initialTodos?: Todo[];
}

/**
 * Page Todo List finale - Architecture complète
 * Utilise tous les composants séparés via TodoApp
 */
const TodoPage: React.FC<TodoPageProps> = ({
  initialTodos = []
}) => {

  return (
    <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Espacement pour le header global de l'app */}
      <Space h="md" />
      
      {/* Application Todo complète */}
      <TodoApp initialTodos={initialTodos} />
    </Box>
  );
};

export default TodoPage;