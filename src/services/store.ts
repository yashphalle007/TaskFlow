import { Task, TeamMember } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { isBefore, parseISO } from 'date-fns';

export const INITIAL_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@taskflow.in', role: 'Operations Manager', avatar: 'RS' },
  { id: '2', name: 'Priya Patil', email: 'priya@taskflow.in', role: 'Sales Lead', avatar: 'PP' },
  { id: '3', name: 'Amit Kulkarni', email: 'amit@taskflow.in', role: 'Technical Lead', avatar: 'AK' },
  { id: '4', name: 'Neha Shah', email: 'neha@taskflow.in', role: 'Product & Design', avatar: 'NS' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Send GST invoice to ABC Traders',
    description: 'Prepare and dispatch the revised GST invoice with correct HSN codes for the September batch order.',
    assignedTo: '1',
    assignedToName: 'Rahul Sharma',
    priority: 'HIGH',
    status: 'To Do',
    // Overdue: yesterday at 5:00 PM
    deadline: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't2',
    title: 'Update company website homepage',
    description: 'Replace outdated product catalog with the festive season collection and update support contact numbers.',
    assignedTo: '3',
    assignedToName: 'Amit Kulkarni',
    priority: 'HIGH',
    status: 'In Progress',
    // Due today in 2 hours
    deadline: new Date(Date.now() + 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 't3',
    title: 'Call pending customer for payment clearance',
    description: 'Follow up with Sharma Textiles regarding pending balance clearance of ₹45,000 before month-end.',
    assignedTo: '2',
    assignedToName: 'Priya Patil',
    priority: 'MEDIUM',
    status: 'In Progress',
    // Due today 6:00 PM
    deadline: new Date(Date.now() + 14400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Review employee biometric attendance & leaves',
    description: 'Verify warehouse staff log entries for the 3rd week of September and calculate overtime hours.',
    assignedTo: '1',
    assignedToName: 'Rahul Sharma',
    priority: 'HIGH',
    status: 'To Do',
    // Overdue: 2 days ago
    deadline: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 't5',
    title: 'Follow up with raw material supplier in Pune',
    description: 'Inquire about delayed raw packaging cartons shipment (Order #9822) and get delivery dispatch receipt.',
    assignedTo: '4',
    assignedToName: 'Neha Shah',
    priority: 'MEDIUM',
    status: 'In Progress',
    // Due tomorrow
    deadline: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't6',
    title: 'Perform monthly physical inventory count',
    description: 'Reconcile stock count of finished units in section B with spreadsheet figures to detect discrepancies.',
    assignedTo: '1',
    assignedToName: 'Rahul Sharma',
    priority: 'LOW',
    status: 'To Do',
    // Due in 3 days
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't7',
    title: 'Process Diwali festive corporate order #402',
    description: 'Finalize customized gift hamper packaging specs and dispatch confirmation note to client.',
    assignedTo: '2',
    assignedToName: 'Priya Patil',
    priority: 'HIGH',
    status: 'Completed',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't8',
    title: 'Schedule client demo meeting with Mehra Logistics',
    description: 'Demonstrate the new vendor portal interface over Zoom and gather preliminary integration feedback.',
    assignedTo: '2',
    assignedToName: 'Priya Patil',
    priority: 'MEDIUM',
    status: 'Completed',
    deadline: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't9',
    title: 'Update Instagram and WhatsApp business catalog',
    description: 'Upload high-resolution product photos and update pricing list for new festive arrivals.',
    assignedTo: '4',
    assignedToName: 'Neha Shah',
    priority: 'LOW',
    status: 'Completed',
    deadline: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 't10',
    title: 'Prepare monthly financial summary report',
    description: 'Compile gross revenue, operational expenses, GST liabilities, and pending receivables for management review.',
    assignedTo: '1',
    assignedToName: 'Rahul Sharma',
    priority: 'HIGH',
    status: 'Completed',
    deadline: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 't11',
    title: 'Setup automated WhatsApp order confirmation template',
    description: 'Configure standard message templates for dispatched orders with tracking URL placeholder.',
    assignedTo: '3',
    assignedToName: 'Amit Kulkarni',
    priority: 'MEDIUM',
    status: 'To Do',
    // Due in 4 days
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class DataStore {
  private tasks: Task[] = [];
  private members: TeamMember[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadData();
  }

  public resetToDefault() {
    this.tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
    this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
    this.checkOverdueTasks();
    this.saveTasks();
    this.saveMembers();
  }

  private loadData() {
    const storedTasks = localStorage.getItem('taskflow_tasks');
    const storedMembers = localStorage.getItem('taskflow_members');

    if (storedTasks) {
      try {
        this.tasks = JSON.parse(storedTasks);
      } catch {
        this.tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
      }
    } else {
      this.tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
      this.saveTasks();
    }

    if (storedMembers) {
      try {
        this.members = JSON.parse(storedMembers);
      } catch {
        this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
      }
    } else {
      this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
      this.saveMembers();
    }

    this.checkOverdueTasks();
  }

  private saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    this.notify();
  }

  private saveMembers() {
    localStorage.setItem('taskflow_members', JSON.stringify(this.members));
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public checkOverdueTasks() {
    let changed = false;
    const now = new Date();
    this.tasks = this.tasks.map((t) => {
      if (t.status !== 'Completed') {
        const deadline = parseISO(t.deadline);
        if (isBefore(deadline, now) && t.status !== 'OVERDUE') {
          changed = true;
          return { ...t, status: 'OVERDUE' };
        } else if (!isBefore(deadline, now) && t.status === 'OVERDUE') {
          changed = true;
          return { ...t, status: 'To Do' };
        }
      }
      return t;
    });
    if (changed) this.saveTasks();
  }

  getTasks(): Task[] {
    this.checkOverdueTasks();
    return this.tasks;
  }

  getMembers(): TeamMember[] {
    return this.members;
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks = [newTask, ...this.tasks];
    this.checkOverdueTasks();
    this.saveTasks();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    this.checkOverdueTasks();
    this.saveTasks();
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasks();
  }

  addMember(memberData: Omit<TeamMember, 'id'>): TeamMember {
    const newMember: TeamMember = {
      ...memberData,
      id: uuidv4(),
    };
    this.members = [...this.members, newMember];
    this.saveMembers();
    return newMember;
  }
}

export const store = new DataStore();
