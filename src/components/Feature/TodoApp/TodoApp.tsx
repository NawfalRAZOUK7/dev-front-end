// TodoApp.tsx - Orchestrateur principal utilisant tous les composants séparés
import React, { useCallback, useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoActions from './TodoActions';
import TodoNotifications from './TodoNotifications';
import { type TodoAppProps } from '../../../types/todo.types';
import { useTodos } from '../../../hooks/useTodos';

const TodoApp: React.FC<TodoAppProps> = ({ initialTodos = [] }) => {
  
  // États locaux pour les notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  /**
   * Configuration du hook useTodos avec données par défaut
   */
  const todosConfig = {
    initialTodos: initialTodos.length > 0 ? initialTodos : [
      { 
        id: '1', 
        text: 'Installer NodeJs', 
        completed: true, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: '2', 
        text: 'Installer Angular CLI', 
        completed: true, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: '3', 
        text: 'Générer un projet', 
        completed: true, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: '4', 
        text: 'Se positionner dans le projet', 
        completed: true, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: '5', 
        text: 'Lancer l\'application', 
        completed: true, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ],
    onError: useCallback((error: string) => {
      setNotification({ type: 'error', message: error });
      setTimeout(() => setNotification(null), 5000);
    }, []),
    onSuccess: useCallback((message: string) => {
      setNotification({ type: 'success', message });
      setTimeout(() => setNotification(null), 3000);
    }, [])
  };

  // Hook principal pour la gestion des todos
  const {
    todos,
    editState,
    inputText,
    validationError,
    isLoading,
    setInputText,
    handleSubmit,
    toggleTodo,
    deleteTodo,
    startEdit,
    cancelEdit,
    clearAllTodos,
    markAllCompleted,
    markAllPending
  } = useTodos(todosConfig);

  /**
   * Gère la soumission du formulaire
   */
  const handleFormSubmit = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  /**
   * Gère l'annulation d'édition
   */
  const handleCancelEdit = useCallback(() => {
    cancelEdit();
  }, [cancelEdit]);

  /**
   * Ferme la notification
   */
  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      margin: 0, 
      padding: 0 
    }}>
      
      {/* Notifications flottantes */}
      <TodoNotifications 
        notification={notification}
        onClose={closeNotification}
      />

      {/* Header avec gradient */}
      <TodoHeader title="Todo List" />

      {/* Container principal */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 1rem' 
      }}>
        
        {/* Actions groupées */}
        <TodoActions
          todosCount={todos.length}
          onMarkAllCompleted={markAllCompleted}
          onMarkAllPending={markAllPending}
          onClearAll={clearAllTodos}
        />

        {/* Formulaire d'ajout/édition */}
        <TodoForm
          value={inputText}
          onChange={setInputText}
          onSubmit={handleFormSubmit}
          onCancel={editState.isEditing ? handleCancelEdit : undefined}
          isEditing={editState.isEditing}
          disabled={isLoading}
          placeholder={editState.isEditing ? "Modifier la tâche..." : "New task"}
        />

        {/* Affichage des erreurs de validation */}
        {validationError && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {validationError}
          </div>
        )}

        {/* Liste des todos */}
        <TodoList
          todos={todos}
          editState={editState}
          onToggleTodo={toggleTodo}
          onEditTodo={deleteTodo} // Placeholder requis par l'interface
          onDeleteTodo={deleteTodo}
          onStartEdit={startEdit}
        />
      </div>
    </div>
  );
};

export default TodoApp;