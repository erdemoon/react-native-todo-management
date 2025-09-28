import { create } from 'zustand';

import { List, Task } from '@/types';

export interface ListsState {
  lists: List[];
  currentList: List | undefined;
  setLists: (lists: List[]) => void;
  setCurrentList: (list: List) => void;
}

export interface TasksState {
  tasks: Task[];
  currentTask: Task | undefined;
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task) => void;
}

interface LoadingState {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const useListsStore = create<ListsState>((set) => ({
  lists: [],
  currentList: undefined,
  setLists: (lists) => set({ lists }),
  setCurrentList: (list) => set({ currentList: list }),
}));

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  currentTask: undefined,
  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (task) => set({ currentTask: task }),
}));

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),
}));
