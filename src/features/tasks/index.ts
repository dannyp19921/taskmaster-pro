// /src/features/tasks/index.ts - Clean feature exports! 🎯

// Export all hooks
export { useTasks } from './hooks/useTasks';
export { useTaskFilters } from './hooks/useTaskFilters';
export { useDashboardData } from './hooks/useDashboardData';

// Export components
export { TaskForm } from './components/TaskForm';
export { default as TaskCard } from './components/TaskCard';

// Export types
export * from './types/task.types';