// Fonctions utilitaires pour la gestion des todos
// - Validation du texte des tâches (non vide, longueur max)
// - Génération d'ID unique pour nouveaux todos
// - Formatage des dates de création/modification
// - Fonctions de tri et filtrage des todos

import { 
  type Todo, 
  type CreateTodoInput, 
  type TodoValidationConfig, 
  type ValidationResult, 
  TodoStatus, 
  type TodoFilters, 
  TodoSortBy, 
  type TodoSortOptions 
} from '../types/todo.types';

/**
 * Configuration par défaut pour la validation des todos
 */
export const DEFAULT_VALIDATION_CONFIG: TodoValidationConfig = {
  minLength: 1,
  maxLength: 500,
  allowEmpty: false
};

/**
 * Génère un ID unique pour un nouveau todo
 * @returns string - ID unique basé sur timestamp et random
 */
export const generateTodoId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 7);
  return `todo_${timestamp}_${randomPart}`;
};

/**
 * Valide le texte d'un todo selon la configuration donnée
 * @param text - Texte à valider
 * @param config - Configuration de validation (optionnelle)
 * @returns ValidationResult - Résultat de la validation
 */
export const validateTodoText = (
  text: string,
  config: TodoValidationConfig = DEFAULT_VALIDATION_CONFIG
): ValidationResult => {
  // Nettoie le texte (supprime les espaces en début/fin)
  const trimmedText = text.trim();
  
  // Vérifie si vide
  if (!config.allowEmpty && trimmedText.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Le texte de la tâche ne peut pas être vide'
    };
  }
  
  // Vérifie la longueur minimale
  if (trimmedText.length < config.minLength) {
    return {
      isValid: false,
      errorMessage: `Le texte doit contenir au moins ${config.minLength} caractère(s)`
    };
  }
  
  // Vérifie la longueur maximale
  if (trimmedText.length > config.maxLength) {
    return {
      isValid: false,
      errorMessage: `Le texte ne peut pas dépasser ${config.maxLength} caractères`
    };
  }
  
  return {
    isValid: true
  };
};

/**
 * Crée un nouveau todo à partir d'un input
 * @param input - Données d'entrée pour créer le todo
 * @returns Todo - Nouveau todo créé
 */
export const createTodo = (input: CreateTodoInput): Todo => {
  const now = new Date();
  
  return {
    id: generateTodoId(),
    text: input.text.trim(),
    completed: input.completed ?? false,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Met à jour un todo existant avec nouvelles données
 * @param existingTodo - Todo existant
 * @param updates - Mises à jour à appliquer
 * @returns Todo - Todo mis à jour
 */
export const updateTodo = (
  existingTodo: Todo,
  updates: { text?: string; completed?: boolean }
): Todo => {
  return {
    ...existingTodo,
    ...(updates.text !== undefined && { text: updates.text.trim() }),
    ...(updates.completed !== undefined && { completed: updates.completed }),
    updatedAt: new Date()
  };
};

/**
 * Filtre une liste de todos selon les critères donnés
 * @param todos - Liste des todos à filtrer
 * @param filters - Critères de filtrage
 * @returns Todo[] - Liste filtrée
 */
export const filterTodos = (todos: Todo[], filters: TodoFilters): Todo[] => {
  let filteredTodos = todos;
  
  // Filtre par statut
  switch (filters.status) {
    case TodoStatus.COMPLETED:
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;
    case TodoStatus.PENDING:
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;
    case TodoStatus.ALL:
    default:
      // Pas de filtrage par statut
      break;
  }
  
  // Filtre par texte de recherche
  if (filters.searchText && filters.searchText.trim().length > 0) {
    const searchLower = filters.searchText.toLowerCase().trim();
    filteredTodos = filteredTodos.filter(todo =>
      todo.text.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredTodos;
};

/**
 * Trie une liste de todos selon les options données
 * @param todos - Liste des todos à trier
 * @param sortOptions - Options de tri
 * @returns Todo[] - Liste triée
 */
export const sortTodos = (todos: Todo[], sortOptions: TodoSortOptions): Todo[] => {
  const { sortBy, sortOrder } = sortOptions;
  
  return [...todos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case TodoSortBy.TEXT:
        comparison = a.text.localeCompare(b.text);
        break;
      case TodoSortBy.STATUS:
        // Les tâches non terminées en premier par défaut
        comparison = Number(a.completed) - Number(b.completed);
        break;
      case TodoSortBy.CREATED_DATE:
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case TodoSortBy.UPDATED_DATE:
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

/**
 * Trouve un todo par son ID
 * @param todos - Liste des todos
 * @param id - ID du todo à trouver
 * @returns Todo | undefined - Todo trouvé ou undefined
 */
export const findTodoById = (todos: Todo[], id: string): Todo | undefined => {
  return todos.find(todo => todo.id === id);
};

/**
 * Compte les todos par statut
 * @param todos - Liste des todos
 * @returns Object - Compteurs par statut
 */
export const countTodosByStatus = (todos: Todo[]) => {
  return {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length
  };
};

/**
 * Formatage des dates pour l'affichage
 * @param date - Date à formater
 * @param locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns string - Date formatée
 */
export const formatTodoDate = (date: Date, locale: string = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Formatage relatif des dates (il y a X minutes/heures/jours)
 * @param date - Date à formater
 * @param locale - Locale pour le formatage (défaut: 'fr-FR')
 * @returns string - Date relative formatée
 */
export const formatRelativeDate = (date: Date, locale: string = 'fr-FR'): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'À l\'instant';
  } else if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else {
    return formatTodoDate(date, locale);
  }
};

/**
 * Nettoie et normalise le texte d'un todo
 * @param text - Texte à nettoyer
 * @returns string - Texte nettoyé
 */
export const sanitizeTodoText = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
    .replace(/^\s+|\s+$/g, ''); // Supprime les espaces en début/fin
};

/**
 * Vérifie si deux todos sont identiques (contenu)
 * @param todo1 - Premier todo
 * @param todo2 - Deuxième todo
 * @returns boolean - True si identiques
 */
export const isTodoEqual = (todo1: Todo, todo2: Todo): boolean => {
  return (
    todo1.id === todo2.id &&
    todo1.text === todo2.text &&
    todo1.completed === todo2.completed
  );
};