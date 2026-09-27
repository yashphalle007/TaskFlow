export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'To Do' | 'In Progress' | 'Completed' | 'OVERDUE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName: string;
  priority: Priority;
  status: Status;
  deadline: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}
