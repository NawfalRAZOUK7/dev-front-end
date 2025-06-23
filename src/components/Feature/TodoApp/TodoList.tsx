// TodoList.tsx - Composant liste séparé
import React from 'react';
import TodoItem from './TodoItem';
import { type TodoListProps } from '../../../types/todo.types';

const TodoList: React.FC<TodoListProps> = ({
  todos,
  editState,
  onToggleTodo,
  onEditTodo, // Requis par l'interface
  onDeleteTodo,
  onStartEdit
}) => {

  /**
   * Vérifie si une tâche est en cours d'édition
   */
  const isTaskEditing = (todoId: string): boolean => {
    return editState.isEditing && editState.editingId === todoId;
  };

  /**
   * Calcule les statistiques
   */
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0'
    }}>
      
      {todos.length === 0 ? (
        /* État vide */
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</div>
          <p style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 8px 0' }}>
            Aucune tâche pour le moment
          </p>
          <p style={{ 
            fontSize: '14px', 
            margin: 0, 
            maxWidth: '300px', 
            marginLeft: 'auto', 
            marginRight: 'auto' 
          }}>
            Ajoutez votre première tâche en utilisant le formulaire ci-dessus.
          </p>
        </div>
      ) : (
        <>
          {/* Statistiques */}
          <div style={{ 
            marginBottom: '1rem', 
            padding: '8px', 
            background: '#f8f9fa', 
            borderRadius: '4px', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            📊 Total: {stats.total} | ✅ Terminées: {stats.completed} | ⏳ En cours: {stats.pending}
          </div>
          
          {/* Liste des todos */}
          <div>
            {todos.map((todo, index) => (
              <React.Fragment key={todo.id}>
                <TodoItem
                  todo={todo}
                  isEditing={isTaskEditing(todo.id)}
                  onToggle={onToggleTodo}
                  onEdit={onEditTodo}
                  onDelete={onDeleteTodo}
                  onStartEdit={onStartEdit}
                />
                {/* Pas de border-bottom pour le dernier élément */}
                {index === todos.length - 1 && (
                  <div style={{ marginTop: '12px' }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;