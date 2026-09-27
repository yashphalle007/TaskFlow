import { useState, useEffect } from 'react';
import { store } from '@/services/store';
import { Task, TeamMember } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(store.getTasks());

  useEffect(() => {
    return store.subscribe(() => {
      setTasks(store.getTasks());
    });
  }, []);

  return {
    tasks,
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => store.addTask(task),
    updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => store.updateTask(id, updates),
    deleteTask: (id: string) => store.deleteTask(id),
    resetToDefault: () => store.resetToDefault(),
  };
}

export function useMembers() {
  const [members, setMembers] = useState<TeamMember[]>(store.getMembers());

  useEffect(() => {
    return store.subscribe(() => {
      setMembers(store.getMembers());
    });
  }, []);

  return {
    members,
    addMember: (member: Omit<TeamMember, 'id'>) => store.addMember(member),
  };
}
