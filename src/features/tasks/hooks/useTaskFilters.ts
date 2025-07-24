// /src/features/tasks/hooks/useTaskFilters.ts
import { useState, useMemo } from 'react';
import { Task, FilterType, SortType } from '../types'; // 🔧 Fixed import path

interface UseTaskFiltersReturn {
  // Filtered results
  filteredTasks: Task[];
  
  // Filter state
  searchText: string;
  filter: FilterType;
  categoryFilter: string;
  sortBy: SortType;
  
  // Filter actions
  setSearchText: (text: string) => void;
  setFilter: (filter: FilterType) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sort: SortType) => void;
  clearFilters: () => void;
  
  // Filter stats
  filterStats: {
    total: number;
    filtered: number;
    hasActiveFilters: boolean;
  };
}

export const useTaskFilters = (tasks: Task[]): UseTaskFiltersReturn => {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');

  // 🔍 Apply all filters and sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1️⃣ Status filter
    if (filter === 'active') {
      result = result.filter(task => task.status === 'open');
    } else if (filter === 'completed') {
      result = result.filter(task => task.status === 'completed');
    }

    // 2️⃣ Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(task => (task.category || 'Personlig') === categoryFilter);
    }

    // 3️⃣ Search filter
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // 4️⃣ Sorting
    if (sortBy === 'priority') {
      const priorityOrder: Record<Task['priority'], number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
      result.sort((a, b) => 
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      );
    } else if (sortBy === 'date') {
      result.sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      );
    }
    // 'none' keeps original order

    return result;
  }, [tasks, searchText, filter, categoryFilter, sortBy]);

  // 📊 Filter statistics
  const filterStats = useMemo(() => ({
    total: tasks.length,
    filtered: filteredTasks.length,
    hasActiveFilters: searchText.trim() !== '' || 
                     filter !== 'all' || 
                     categoryFilter !== 'all' || 
                     sortBy !== 'date'
  }), [tasks.length, filteredTasks.length, searchText, filter, categoryFilter, sortBy]);

  // 🔄 Clear all filters
  const clearFilters = () => {
    setSearchText('');
    setFilter('all');
    setCategoryFilter('all');
    setSortBy('date');
  };

  return {
    // Results
    filteredTasks,
    
    // State
    searchText,
    filter,
    categoryFilter,
    sortBy,
    
    // Actions
    setSearchText,
    setFilter,
    setCategoryFilter,
    setSortBy,
    clearFilters,
    
    // Stats
    filterStats,
  };
};