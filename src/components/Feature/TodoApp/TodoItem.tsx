// TodoItem.tsx - Composant item individuel séparé
import React, { useState, useCallback } from 'react';
import { IconEdit, IconTrash, IconCheck } from '@tabler/icons-react';
import ModalDialog from '../../Common/ModalDialog';
import { type TodoItemProps } from '../../../types/todo.types';

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  onToggle,
  // onEdit, // Requis par l'interface mais non utilisé
  onDelete,
  onStartEdit
}) => {
  
  // États locaux pour les double-clicks
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editClickCount, setEditClickCount] = useState(0);
  const [deleteClickCount, setDeleteClickCount] = useState(0);
  const [editClickTimer, setEditClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [deleteClickTimer, setDeleteClickTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * Gère le double-click pour l'édition
   */
  const handleEditClick = useCallback(() => {
    setEditClickCount(prev => prev + 1);
    
    if (editClickTimer) {
      clearTimeout(editClickTimer);
    }
    
    if (editClickCount === 1) {
      setEditClickCount(0);
      setEditClickTimer(null);
      onStartEdit(todo.id, todo.text);
      return;
    }
    
    const timer = setTimeout(() => {
      setEditClickCount(0);
      setEditClickTimer(null);
    }, 500);
    
    setEditClickTimer(timer);
  }, [editClickCount, editClickTimer, onStartEdit, todo.id, todo.text]);

  /**
   * Gère le double-click pour la suppression
   */
  const handleDeleteClick = useCallback(() => {
    setDeleteClickCount(prev => prev + 1);
    
    if (deleteClickTimer) {
      clearTimeout(deleteClickTimer);
    }
    
    if (deleteClickCount === 1) {
      setDeleteClickCount(0);
      setDeleteClickTimer(null);
      setShowDeleteModal(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setDeleteClickCount(0);
      setDeleteClickTimer(null);
    }, 500);
    
    setDeleteClickTimer(timer);
  }, [deleteClickCount, deleteClickTimer]);

  /**
   * Confirme la suppression
   */
  const handleConfirmDelete = useCallback(() => {
    onDelete(todo.id);
    setShowDeleteModal(false);
  }, [onDelete, todo.id]);

  /**
   * Annule la suppression
   */
  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  /**
   * Gère le toggle de la checkbox
   */
  const handleToggleChange = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  /**
   * Nettoie les timers lors du démontage
   */
  React.useEffect(() => {
    return () => {
      if (editClickTimer) clearTimeout(editClickTimer);
      if (deleteClickTimer) clearTimeout(deleteClickTimer);
    };
  }, [editClickTimer, deleteClickTimer]);

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: isEditing ? '#f0f8ff' : 'transparent',
        borderLeft: isEditing ? '3px solid #4A90E2' : 'none',
        paddingLeft: isEditing ? '9px' : '0'
      }}>
        
        {/* Checkbox personnalisée */}
        <div
          onClick={handleToggleChange}
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid ' + (todo.completed ? '#22c55e' : '#d0d0d0'),
            borderRadius: '4px',
            background: todo.completed ? '#22c55e' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {todo.completed && <IconCheck size={14} color="white" />}
        </div>
        
        {/* Texte de la tâche */}
        <span style={{
          flex: 1,
          fontSize: '16px',
          color: todo.completed ? '#9ca3af' : '#374151',
          textDecoration: todo.completed ? 'line-through' : 'none'
        }}>
          {todo.text}
        </span>
        
        {/* Indicateur d'édition */}
        {isEditing && (
          <span style={{ 
            fontSize: '12px', 
            color: '#4A90E2', 
            fontWeight: 600 
          }}>
            • En cours d'édition
          </span>
        )}
        
        {/* Bouton Modifier */}
        <button 
          onClick={handleEditClick}
          disabled={isEditing}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            background: editClickCount === 1 ? '#e5e7eb' : 'transparent',
            borderRadius: '4px',
            cursor: isEditing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            opacity: isEditing ? 0.5 : 1
          }}
          title={editClickCount === 1 ? "Cliquez encore pour modifier" : "Double-cliquez pour modifier"}
        >
          <IconEdit size={16} />
        </button>
        
        {/* Bouton Supprimer */}
        <button 
          onClick={handleDeleteClick}
          disabled={isEditing}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            background: deleteClickCount === 1 ? '#fee2e2' : 'transparent',
            borderRadius: '4px',
            cursor: isEditing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: deleteClickCount === 1 ? '#dc2626' : '#6b7280',
            opacity: isEditing ? 0.5 : 1
          }}
          title={deleteClickCount === 1 ? "Cliquez encore pour supprimer" : "Double-cliquez pour supprimer"}
        >
          <IconTrash size={16} />
        </button>
      </div>

      {/* Modal de confirmation de suppression */}
      <ModalDialog
        opened={showDeleteModal}
        onClose={handleCancelDelete}
        title="Confirmer la suppression"
        size="sm"
        centered={true}
        animated={true}
        animationType="scale"
        primaryAction={{
          key: "confirm",
          label: "Supprimer",
          variant: "filled",
          color: "red",
          onClick: handleConfirmDelete,
          closeOnClick: true
        }}
        secondaryAction={{
          key: "cancel",
          label: "Annuler",
          variant: "light",
          onClick: handleCancelDelete,
          closeOnClick: true
        }}
      >
        <div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '14px' }}>
            Êtes-vous sûr de vouloir supprimer cette tâche ?
          </p>
          
          <div style={{
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              "{todo.text}"
            </p>
          </div>
          
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
            Cette action est irréversible.
          </p>
        </div>
      </ModalDialog>
    </>
  );
};

export default TodoItem;