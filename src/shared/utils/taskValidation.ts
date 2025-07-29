// /src/shared/utils/taskValidation.ts - Felles validering for alle task forms! ✅

import { TaskFormData } from '../../features/tasks/components/TaskForm';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validerer task form data
 * Brukes av både CreateTaskScreen og TaskDetailScreen
 */
export const validateTaskForm = (formData: TaskFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Title validation
  if (!formData.title.trim()) {
    errors.title = 'Tittel er påkrevd';
  } else if (formData.title.trim().length < 2) {
    errors.title = 'Tittel må være minst 2 tegn';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Tittel kan ikke være lengre enn 100 tegn';
  }

  // Due date validation
  if (!formData.due_date) {
    errors.due_date = 'Forfallsdato er påkrevd';
  } else {
    const dueDate = new Date(formData.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.due_date = 'Forfallsdato kan ikke være i fortiden';
    }
  }

  // Description validation (optional)
  if (formData.description && formData.description.length > 500) {
    errors.description = 'Beskrivelse kan ikke være lengre enn 500 tegn';
  }

  // Priority validation
  const validPriorities = ['Low', 'Medium', 'High'];
  if (!validPriorities.includes(formData.priority)) {
    errors.priority = 'Ugyldig prioritet valgt';
  }

  // Category validation
  if (!formData.category.trim()) {
    errors.category = 'Kategori er påkrevd';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Quick validation for title only (for real-time feedback)
 */
export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Tittel er påkrevd';
  }
  if (title.trim().length < 2) {
    return 'Tittel må være minst 2 tegn';
  }
  if (title.trim().length > 100) {
    return 'Tittel kan ikke være lengre enn 100 tegn';
  }
  return null;
};

/**
 * Quick validation for due date only
 */
export const validateDueDate = (dateString: string): string | null => {
  if (!dateString) {
    return 'Forfallsdato er påkrevd';
  }
  
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dueDate < today) {
    return 'Forfallsdato kan ikke være i fortiden';
  }
  
  return null;
};