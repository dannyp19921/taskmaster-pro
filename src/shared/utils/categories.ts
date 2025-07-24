// /src/shared/utils/categories.ts
export interface CategoryOption {
  value: string;
  label: string;
  color: string;
  icon: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'Jobb', label: '💼 Jobb', color: '#2196F3', icon: '💼' },
  { value: 'Personlig', label: '🏠 Personlig', color: '#4CAF50', icon: '🏠' },
  { value: 'Utdanning', label: '📚 Utdanning', color: '#FF9800', icon: '📚' },
  { value: 'Helse', label: '💪 Helse', color: '#E91E63', icon: '💪' },
  { value: 'Økonomi', label: '💰 Økonomi', color: '#9C27B0', icon: '💰' },
  { value: 'Shopping', label: '🛒 Shopping', color: '#FF5722', icon: '🛒' },
  { value: 'Reise', label: '✈️ Reise', color: '#00BCD4', icon: '✈️' },
  { value: 'Hobby', label: '🎨 Hobby', color: '#795548', icon: '🎨' },
];

export const getCategoryInfo = (categoryValue: string): CategoryOption => {
  return CATEGORY_OPTIONS.find(cat => cat.value === categoryValue) || {
    value: categoryValue,
    label: categoryValue,
    color: '#757575',
    icon: '📝'
  };
};