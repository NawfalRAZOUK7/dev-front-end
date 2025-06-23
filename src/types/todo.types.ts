// Types TypeScript pour la Todo List
// - Interface Todo avec id, text, completed, createdAt, updatedAt
// - Types pour les actions de gestion des todos
// - Énumérations pour les filtres et status

/**
 * Interface principale pour un todo
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type pour créer un nouveau todo (sans id et dates)
 */
export type CreateTodoInput = {
  text: string;
  completed?: boolean;
};

/**
 * Type pour mettre à jour un todo existant
 */
export type UpdateTodoInput = {
  id: string;
  text?: string;
  completed?: boolean;
};

/**
 * États possibles d'un todo
 */
export const TodoStatus = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  ALL: 'all'
} as const;

export type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus];

/**
 * Types d'actions possibles sur les todos
 */
export const TodoActionType = {
  ADD: 'ADD_TODO',
  DELETE: 'DELETE_TODO',
  TOGGLE: 'TOGGLE_TODO',
  EDIT: 'EDIT_TODO',
  START_EDIT: 'START_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT'
} as const;

export type TodoActionType = typeof TodoActionType[keyof typeof TodoActionType];

/**
 * Structure pour les actions du reducer (si nécessaire)
 */
export type TodoAction =
  | { type: typeof TodoActionType.ADD; payload: CreateTodoInput }
  | { type: typeof TodoActionType.DELETE; payload: { id: string } }
  | { type: typeof TodoActionType.TOGGLE; payload: { id: string } }
  | { type: typeof TodoActionType.EDIT; payload: UpdateTodoInput }
  | { type: typeof TodoActionType.START_EDIT; payload: { id: string; text: string } }
  | { type: typeof TodoActionType.CANCEL_EDIT };

/**
 * État pour le mode édition
 */
export interface EditState {
  isEditing: boolean;
  editingId: string | null;
  editText: string;
}

/**
 * Props pour les composants Todo
 */
export interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
}

export interface TodoListProps {
  todos: Todo[];
  editState: EditState;
  onToggleTodo: (id: string) => void;
  onEditTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
}

export interface TodoFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isEditing: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export interface TodoAppProps {
  initialTodos?: Todo[];
}

/**
 * Configuration pour les validations
 */
export interface TodoValidationConfig {
  minLength: number;
  maxLength: number;
  allowEmpty: boolean;
}

/**
 * Résultat de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Filtres pour l'affichage des todos
 */
export interface TodoFilters {
  status: TodoStatus;
  searchText?: string;
}

/**
 * Options de tri pour les todos
 */
export const TodoSortBy = {
  CREATED_DATE: 'createdAt',
  UPDATED_DATE: 'updatedAt',
  TEXT: 'text',
  STATUS: 'completed'
} as const;

export type TodoSortBy = typeof TodoSortBy[keyof typeof TodoSortBy];

export interface TodoSortOptions {
  sortBy: TodoSortBy;
  sortOrder: 'asc' | 'desc';
}