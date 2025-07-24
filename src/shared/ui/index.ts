// /src/shared/ui/index.ts - Fixed exports

// 🔹 Atoms
export { Button } from './atoms/Button';
export { Input } from './atoms/Input';
export { Text } from './atoms/Text';

// 🔸 Molecules - Fixed default exports
export { default as SearchBox } from './molecules/SearchBox';
export { default as FilterButtons } from './molecules/FilterButtons';
export { default as ThemeToggle } from './molecules/ThemeToggle';

// 🔶 Organisms (når de blir laget)
export { TaskFilterPanel } from './organisms/TaskFilterPanel';
export { EmptyState } from './organisms/EmptyState';
export { Header } from './organisms/Header';

// 📱 Types
export type { ButtonVariant, ButtonSize } from './atoms/Button';
export type { InputVariant, InputSize } from './atoms/Input';
export type { TextVariant, TextColor } from './atoms/Text';
// export type { FilterType } from './molecules/FilterButtons'; // Kommenter ut midlertidig