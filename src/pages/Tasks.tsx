import React, { useState, useMemo } from 'react';
import { useTasks, useMembers } from '@/hooks/useData';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Check, 
  Edit2, 
  Trash2, 
  Plus, 
  LayoutList, 
  Kanban,
  Calendar,
  X,
  ArrowUpDown,
  User,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import TaskModal from '@/components/TaskModal';
import TaskDetailsDrawer from '@/components/TaskDetailsDrawer';
import { Task, Status, Priority } from '@/types';
import { useToast } from '@/components/ToastProvider';

export default function Tasks() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const { members } = useMembers();
  const { addToast } = useToast();
  
  // UI states
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'title'>('deadline');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Status counts for tabs
  const counts = useMemo(() => {
    return {
      All: tasks.length,
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Completed': tasks.filter(t => t.status === 'Completed').length,
      'OVERDUE': tasks.filter(t => t.status === 'OVERDUE').length,
    };
  }, [tasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
          (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        const matchesAssignee = assigneeFilter === 'All' || t.assignedTo === assigneeFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'priority') {
          const pOrder: { [key: string]: number } = { HIGH: 1, MEDIUM: 2, LOW: 3 };
          return pOrder[a.priority] - pOrder[b.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter, sortBy]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTask(id);
      addToast('Task deleted successfully');
    }
    setActiveMenuId(null);
  };

  const handleChangeStatus = (id: string, newStatus: Status) => {
    updateTask(id, { status: newStatus });
    addToast(`Status updated to ${newStatus}`);
    setActiveMenuId(null);
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const d = parseISO(dateStr);
      if (isToday(d)) return 'Today · ' + format(d, 'h:mm a');
      if (isTomorrow(d)) return 'Tomorrow · ' + format(d, 'h:mm a');
      return format(d, 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            In Progress
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            OVERDUE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            To Do
          </span>
        );
    }
  };

  const hasActiveFilters = search || statusFilter !== 'All' || priorityFilter !== 'All' || assigneeFilter !== 'All';

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setAssigneeFilter('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workflows & Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, and track assignments across your entire business.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle: Table vs Board */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === 'table' ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === 'kanban' ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Kanban className="w-3.5 h-3.5" />
              Board
            </button>
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-600/30 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Create Task
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs space-y-4">
        
        {/* Top Search & Filter Dropdowns */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks by title or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Additional Filter Dropdowns */}
          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            
            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Assignee filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Assignees</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Sorting dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none font-medium cursor-pointer"
              >
                <option value="deadline">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Status Tab Pills with count badges */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-hide">
          {(['All', 'To Do', 'In Progress', 'Completed', 'OVERDUE'] as const).map((status) => {
            const isSelected = statusFilter === status;
            const count = counts[status];
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                )}
              >
                <span>{status === 'OVERDUE' ? 'Overdue' : status}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isSelected 
                    ? "bg-slate-800 text-slate-200" 
                    : status === 'OVERDUE' && count > 0
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-200 text-slate-600"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content: Table View vs Kanban Board View */}
      {viewMode === 'table' ? (
        
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Task</th>
                  <th className="px-5 py-4">Assignee</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Due Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Task Title & description */}
                    <td className="px-6 py-4 max-w-sm">
                      <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {task.assignedToName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-medium text-slate-700">{task.assignedToName}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getPriorityBadge(task.priority)}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={cn(
                        "text-xs font-medium",
                        task.status === 'OVERDUE' ? "text-rose-600 font-bold" : "text-slate-600"
                      )}>
                        {formatDueDate(task.deadline)}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(task.status)}
                    </td>

                    {/* Action menu */}
                    <td className="px-6 py-4 text-right whitespace-nowrap relative" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === task.id && (
                        <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in zoom-in-95 duration-100 text-left">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleEdit(task)}
                            className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                            Edit Task
                          </button>
                          
                          <div className="h-px bg-slate-100 my-1"></div>
                          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Move Status
                          </div>
                          
                          {(['To Do', 'In Progress', 'Completed'] as Status[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => handleChangeStatus(task.id, s)}
                              className="w-full px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                            >
                              <span>{s}</span>
                              {task.status === s && <Check className="w-3.5 h-3.5 text-primary-600" />}
                            </button>
                          ))}

                          <div className="h-px bg-slate-100 my-1"></div>
                          <button
                            onClick={() => handleDelete(task.id, task.title)}
                            className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Task
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                          <Filter className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">No tasks match your criteria</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Try searching with different keywords or clearing your active filters.
                        </p>
                        <button
                          onClick={clearAllFilters}
                          className="mt-4 px-4 py-2 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredTasks.length} of {tasks.length} total tasks</span>
            <span>Click any task to view full details</span>
          </div>
        </div>

      ) : (

        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['To Do', 'In Progress', 'Completed'] as const).map((columnStatus) => {
            const columnTasks = filteredTasks.filter(t => {
              if (columnStatus === 'To Do') return t.status === 'To Do' || t.status === 'OVERDUE';
              return t.status === columnStatus;
            });

            return (
              <div key={columnStatus} className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/60 flex flex-col min-h-[500px]">
                
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      columnStatus === 'Completed' ? "bg-emerald-500" : columnStatus === 'In Progress' ? "bg-blue-500" : "bg-amber-500"
                    )}></span>
                    <h3 className="text-sm font-bold text-slate-900">{columnStatus}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-600 border border-slate-200">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={handleCreate}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                    title="Add task to column"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Cards inside column */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {getPriorityBadge(task.priority)}
                        {task.status === 'OVERDUE' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            Overdue
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center text-[10px] font-bold">
                            {task.assignedToName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="truncate max-w-[100px] text-[11px]">{task.assignedToName}</span>
                        </div>

                        <span className={cn(
                          "text-[11px] font-medium",
                          task.status === 'OVERDUE' ? "text-rose-600 font-bold" : "text-slate-500"
                        )}>
                          {formatDueDate(task.deadline)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                      No tasks in {columnStatus}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      )}

      {/* Task Details Slide-Over Drawer */}
      <TaskDetailsDrawer
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setSelectedTask(null);
          setEditingTask(task);
          setIsModalOpen(true);
        }}
      />

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask || undefined}
      />

    </div>
  );
}
