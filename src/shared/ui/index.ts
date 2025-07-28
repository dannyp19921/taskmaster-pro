// /src/shared/ui/index.ts - Complete UI system with error handling

// 🔹 Atoms
export { Button } from './atoms/Button';
export { Input } from './atoms/Input';
export { Text } from './atoms/Text';
export { SkeletonTaskCard } from './atoms/SkeletonTaskCard';

// 🔸 Molecules
export { default as SearchBox } from './molecules/SearchBox';
export { default as FilterButtons } from './molecules/FilterButtons';
export { default as ThemeToggle } from './molecules/ThemeToggle';
export { DatePicker } from './molecules/DatePicker';
export { Calendar } from './molecules/Calendar';
export { TaskStatus } from './molecules/TaskStatus';
export { TaskActions } from './molecules/TaskActions';
export { CategoryBadge } from './molecules/CategoryBadge';
export { LoadingOverlay } from './molecules/LoadingOverlay';
export { SkeletonList } from './molecules/SkeletonList';
export { ValidationErrorDisplay } from './molecules/ValidationErrorDisplay';

// 🔶 Organisms
export { Header } from './organisms/Header';
export { EmptyState } from './organisms/EmptyState';
export { TaskFilterPanel } from './organisms/TaskFilterPanel';
export { SkeletonDashboard } from './organisms/SkeletonDashboard';
export { ErrorBoundary } from './organisms/ErrorBoundary';
export { NetworkError } from './organisms/NetworkError';
export { 
  StatCard, 
  ProgressBar, 
  CategoryList, 
  PriorityOverview 
} from './organisms/DashboardComponents';

// 📱 Types
export type { ButtonVariant, ButtonSize } from './atoms/Button';
export type { InputVariant, InputSize } from './atoms/Input';
export type { TextVariant, TextColor } from './atoms/Text';