// TodoForm.tsx - Composant formulaire séparé avec style moderne
import React, { useCallback } from 'react';
import { IconPlus, IconDeviceFloppy, IconX, IconCopy } from '@tabler/icons-react';
import { type TodoFormProps } from '../../../types/todo.types';

const TodoForm: React.FC<TodoFormProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
  disabled = false,
  placeholder = "New task"
}) => {
  
  /**
   * Gère la soumission du formulaire
   */
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  }, [onSubmit]);

  /**
   * Détermine si le bouton de soumission doit être désactivé
   */
  const isSubmitDisabled = () => {
    return disabled || value.trim().length === 0;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: isEditing ? '2px solid #4A90E2' : '1px solid #e0e0e0'
    }}>
      {/* Indicateur de mode édition */}
      {isEditing && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '8px', 
          background: '#eff6ff', 
          borderRadius: '4px', 
          fontSize: '14px', 
          color: '#1d4ed8' 
        }}>
          ✏️ Mode édition - Modifiez la tâche et cliquez sur sauvegarder
        </div>
      )}
      
      <form onSubmit={handleFormSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Checkbox placeholder pour le design */}
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #d0d0d0',
            borderRadius: '4px',
            background: '#f8f9fa',
            flexShrink: 0
          }}></div>
          
          {/* Champ de saisie principal */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              padding: '8px 0',
              background: 'transparent'
            }}
          />
          
          {/* Bouton principal (Ajouter/Sauvegarder) */}
          <button 
            type="submit" 
            disabled={isSubmitDisabled()} 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #4A90E2',
              background: '#4A90E2',
              color: 'white',
              cursor: isSubmitDisabled() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSubmitDisabled() ? 0.5 : 1
            }}
          >
            {isEditing ? <IconDeviceFloppy size={18} /> : <IconPlus size={18} />}
          </button>
          
          {/* Bouton secondaire (Annuler/Copier) */}
          {isEditing ? (
            <button 
              type="button" 
              onClick={onCancel} 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #dc2626',
                background: 'white',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconX size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #d0d0d0',
                background: 'white',
                color: '#6c757d',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconCopy size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TodoForm;