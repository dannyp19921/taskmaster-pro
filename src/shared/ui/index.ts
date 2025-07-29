// /src/shared/ui/index.ts - Master UI export hub! 🎨

// Atoms (basic building blocks)
export { Button } from './atoms/Button';
export { Input } from './atoms/Input';
export { Text } from './atoms/Text';

// Molecules (combinations of atoms)
export { 
  DatePicker, 
  PrioritySelector, 
  CategorySelector 
} from './molecules';

// Organisms (complex UI sections)
export { Header } from './organisms/Header';
export { StatCard } from './organisms/DashboardComponents';
export { TaskFilterPanel } from './organisms/TaskFilterPanel';
export { EmptyState } from './organisms/EmptyState';

// Re-export important types
export type { Priority } from './molecules';