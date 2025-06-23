// Hook personnalisé pour la gestion d'état des todos
// - État local avec useState pour la liste des todos
// - État pour le mode édition (editingId, editText)
// - Fonctions : addTodo, deleteTodo, toggleTodo, startEdit, saveEdit, cancelEdit
// - Gestion de la validation lors de l'ajout/modification

import { useState, useCallback } from 'react';
import { 
  type Todo, 
  // type CreateTodoInput, 
  type EditState, 
  type TodoValidationConfig,
  type ValidationResult 
} from '../types/todo.types';
import { 
  createTodo, 
  updateTodo, 
  validateTodoText, 
  findTodoById, 
  sanitizeTodoText,
  DEFAULT_VALIDATION_CONFIG 
} from '../utils/todoUtils';

/**
 * Configuration du hook useTodos
 */
interface UseTodosConfig {
  initialTodos?: Todo[];
  validationConfig?: TodoValidationConfig;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

/**
 * Valeur de retour du hook useTodos
 */
interface UseTodosReturn {
  // État
  todos: Todo[];
  editState: EditState;
  inputText: string;
  validationError: string | null;
  isLoading: boolean;
  
  // Actions principales
  addTodo: () => boolean;
  deleteTodo: (id: string) => boolean;
  toggleTodo: (id: string) => boolean;
  
  // Actions d'édition
  startEdit: (id: string) => boolean;
  saveEdit: () => boolean;
  cancelEdit: () => void;
  
  // Gestion du formulaire
  setInputText: (text: string) => void;
  handleSubmit: () => void;
  resetForm: () => void;
  
  // Validation
  validateInput: (text?: string) => ValidationResult;
  
  // Utilitaires
  getTodoById: (id: string) => Todo | undefined;
  clearAllTodos: () => void;
  markAllCompleted: () => void;
  markAllPending: () => void;
}

/**
 * Hook personnalisé pour la gestion complète des todos
 * @param config - Configuration optionnelle du hook
 * @returns UseTodosReturn - État et actions pour gérer les todos
 */
export const useTodos = (config: UseTodosConfig = {}): UseTodosReturn => {
  const {
    initialTodos = [],
    validationConfig = DEFAULT_VALIDATION_CONFIG,
    onError,
    onSuccess
  } = config;

  // États principaux
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [inputText, setInputText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // État d'édition
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    editingId: null,
    editText: ''
  });

  /**
   * Valide le texte d'entrée
   */
  const validateInput = useCallback((text?: string): ValidationResult => {
    const textToValidate = text !== undefined ? text : inputText;
    const sanitizedText = sanitizeTodoText(textToValidate);
    return validateTodoText(sanitizedText, validationConfig);
  }, [inputText, validationConfig]);

  /**
   * Met à jour le texte d'entrée avec validation en temps réel
   */
  const handleSetInputText = useCallback((text: string) => {
    setInputText(text);
    
    // Validation en temps réel seulement si il y a du texte
    if (text.trim().length > 0) {
      const validation = validateTodoText(sanitizeTodoText(text), validationConfig);
      setValidationError(validation.isValid ? null : validation.errorMessage || null);
    } else {
      setValidationError(null);
    }
  }, [validationConfig]);

  /**
   * Ajoute un nouveau todo
   */
  const addTodo = useCallback((): boolean => {
    setIsLoading(true);
    
    try {
      const validation = validateInput();
      
      if (!validation.isValid) {
        setValidationError(validation.errorMessage || 'Erreur de validation');
        onError?.(validation.errorMessage || 'Erreur de validation');
        return false;
      }

      const sanitizedText = sanitizeTodoText(inputText);
      const newTodo = createTodo({ text: sanitizedText });
      
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
      setValidationError(null);
      
      onSuccess?.(`Tâche "${sanitizedText}" ajoutée avec succès`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout';
      setValidationError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [inputText, validateInput, onError, onSuccess]);

  /**
   * Supprime un todo par ID
   */
  const deleteTodo = useCallback((id: string): boolean => {
    setIsLoading(true);
    
    try {
      const todoToDelete = findTodoById(todos, id);
      
      if (!todoToDelete) {
        const errorMessage = 'Tâche introuvable';
        onError?.(errorMessage);
        return false;
      }

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      // Si on était en train d'éditer cette tâche, annuler l'édition
      if (editState.editingId === id) {
        setEditState({
          isEditing: false,
          editingId: null,
          editText: ''
        });
      }
      
      onSuccess?.(`Tâche "${todoToDelete.text}" supprimée avec succès`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [todos, editState.editingId, onError, onSuccess]);

  /**
   * Bascule l'état complété d'un todo
   */
  const toggleTodo = useCallback((id: string): boolean => {
    setIsLoading(true);
    
    try {
      const todoToToggle = findTodoById(todos, id);
      
      if (!todoToToggle) {
        const errorMessage = 'Tâche introuvable';
        onError?.(errorMessage);
        return false;
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id
            ? updateTodo(todo, { completed: !todo.completed })
            : todo
        )
      );
      
      const statusMessage = !todoToToggle.completed ? 'marquée comme terminée' : 'marquée comme en cours';
      onSuccess?.(`Tâche "${todoToToggle.text}" ${statusMessage}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification';
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [todos, onError, onSuccess]);

  /**
   * Démarre l'édition d'un todo
   */
  const startEdit = useCallback((id: string): boolean => {
    try {
      const todoToEdit = findTodoById(todos, id);
      
      if (!todoToEdit) {
        const errorMessage = 'Tâche introuvable';
        onError?.(errorMessage);
        return false;
      }

      setEditState({
        isEditing: true,
        editingId: id,
        editText: todoToEdit.text
      });
      
      // Charger le texte dans le champ principal
      setInputText(todoToEdit.text);
      setValidationError(null);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'édition';
      onError?.(errorMessage);
      return false;
    }
  }, [todos, onError]);

  /**
   * Sauvegarde les modifications d'édition
   */
  const saveEdit = useCallback((): boolean => {
    if (!editState.isEditing || !editState.editingId) {
      onError?.('Aucune édition en cours');
      return false;
    }

    setIsLoading(true);
    
    try {
      const validation = validateInput();
      
      if (!validation.isValid) {
        setValidationError(validation.errorMessage || 'Erreur de validation');
        onError?.(validation.errorMessage || 'Erreur de validation');
        return false;
      }

      const sanitizedText = sanitizeTodoText(inputText);
      
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editState.editingId
            ? updateTodo(todo, { text: sanitizedText })
            : todo
        )
      );

      // Réinitialiser l'état d'édition
      setEditState({
        isEditing: false,
        editingId: null,
        editText: ''
      });
      
      setInputText('');
      setValidationError(null);
      
      onSuccess?.(`Tâche modifiée en "${sanitizedText}"`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      setValidationError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [editState, inputText, validateInput, onError, onSuccess]);

  /**
   * Annule l'édition en cours
   */
  const cancelEdit = useCallback(() => {
    setEditState({
      isEditing: false,
      editingId: null,
      editText: ''
    });
    setInputText('');
    setValidationError(null);
  }, []);

  /**
   * Gère la soumission du formulaire (ajout ou sauvegarde)
   */
  const handleSubmit = useCallback(() => {
    if (editState.isEditing) {
      saveEdit();
    } else {
      addTodo();
    }
  }, [editState.isEditing, saveEdit, addTodo]);

  /**
   * Remet à zéro le formulaire
   */
  const resetForm = useCallback(() => {
    setInputText('');
    setValidationError(null);
    cancelEdit();
  }, [cancelEdit]);

  /**
   * Trouve un todo par ID
   */
  const getTodoById = useCallback((id: string): Todo | undefined => {
    return findTodoById(todos, id);
  }, [todos]);

  /**
   * Supprime tous les todos
   */
  const clearAllTodos = useCallback(() => {
    setTodos([]);
    resetForm();
    onSuccess?.('Toutes les tâches ont été supprimées');
  }, [resetForm, onSuccess]);

  /**
   * Marque tous les todos comme terminés
   */
  const markAllCompleted = useCallback(() => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.completed ? todo : updateTodo(todo, { completed: true })
      )
    );
    onSuccess?.('Toutes les tâches ont été marquées comme terminées');
  }, [onSuccess]);

  /**
   * Marque tous les todos comme en cours
   */
  const markAllPending = useCallback(() => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        !todo.completed ? todo : updateTodo(todo, { completed: false })
      )
    );
    onSuccess?.('Toutes les tâches ont été marquées comme en cours');
  }, [onSuccess]);

  return {
    // État
    todos,
    editState,
    inputText,
    validationError,
    isLoading,
    
    // Actions principales
    addTodo,
    deleteTodo,
    toggleTodo,
    
    // Actions d'édition
    startEdit,
    saveEdit,
    cancelEdit,
    
    // Gestion du formulaire
    setInputText: handleSetInputText,
    handleSubmit,
    resetForm,
    
    // Validation
    validateInput,
    
    // Utilitaires
    getTodoById,
    clearAllTodos,
    markAllCompleted,
    markAllPending
  };
};