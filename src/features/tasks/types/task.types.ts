// /src/features/tasks/types/task.types.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  status: 'open' | 'completed';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  status?: 'open' | 'completed';
}

export interface TaskFilters {
  status: 'all' | 'active' | 'completed';
  category: string;
  search: string;
  sortBy: 'date' | 'priority' | 'none';
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionRate: number;
}

// Utility types
export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
export type FilterType = TaskFilters['status'];
export type SortType = TaskFilters['sortBy'];