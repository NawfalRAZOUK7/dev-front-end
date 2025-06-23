// TodoActions.tsx - Composant actions groupées séparé
import React from 'react';

interface TodoActionsProps {
  todosCount: number;
  onMarkAllCompleted: () => void;
  onMarkAllPending: () => void;
  onClearAll: () => void;
}

const TodoActions: React.FC<TodoActionsProps> = ({
  todosCount,
  onMarkAllCompleted,
  onMarkAllPending,
  onClearAll
}) => {

  /**
   * Gère la suppression avec confirmation
   */
  const handleClearAll = () => {
    if (todosCount > 0 && window.confirm('Supprimer toutes les tâches ?')) {
      onClearAll();
    }
  };

  // Ne pas afficher si aucune tâche
  if (todosCount === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      
      {/* Label */}
      <span style={{ 
        fontSize: '14px', 
        color: '#6b7280', 
        fontWeight: 500 
      }}>
        Actions groupées:
      </span>
      
      {/* Boutons d'action */}
      <div style={{ display: 'flex', gap: '8px' }}>
        
        {/* Tout terminer */}
        <button 
          onClick={onMarkAllCompleted} 
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            border: '1px solid #22c55e',
            background: 'white',
            color: '#22c55e',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#22c55e';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#22c55e';
          }}
        >
          Tout terminer
        </button>
        
        {/* Tout remettre */}
        <button 
          onClick={onMarkAllPending} 
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            border: '1px solid #f59e0b',
            background: 'white',
            color: '#f59e0b',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f59e0b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#f59e0b';
          }}
        >
          Tout remettre
        </button>
        
        {/* Tout supprimer */}
        <button 
          onClick={handleClearAll} 
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            border: '1px solid #dc2626',
            background: 'white',
            color: '#dc2626',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#dc2626';
          }}
        >
          Tout supprimer
        </button>
      </div>
    </div>
  );
};

export default TodoActions;