import React, { useState } from 'react';
import { useTasks } from '@/hooks/useData';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  Flame,
  Check,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { format, isToday, isTomorrow, parseISO, isBefore } from 'date-fns';
import TaskModal from '@/components/TaskModal';
import TaskDetailsDrawer from '@/components/TaskDetailsDrawer';
import { Task, Status } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ToastProvider';

export default function Dashboard() {
  const { tasks, updateTask } = useTasks();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = format(new Date(), 'EEEE, MMMM d, yyyy');

  // Stats calculation
  const totalTasks = tasks.length;
  const pending = tasks.filter(t => t.status === 'To Do').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const overdue = tasks.filter(t => t.status === 'OVERDUE').length;

  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  // Urgent attention task: highest priority among overdue or high priority pending
  const urgentTask = tasks.find(t => t.status === 'OVERDUE' && t.priority === 'HIGH') 
    || tasks.find(t => t.status === 'OVERDUE')
    || tasks.find(t => t.priority === 'HIGH' && t.status !== 'Completed');

  const recentTasks = tasks.slice(0, 6);

  const statCards = [
    { 
      label: 'Total Tasks', 
      value: totalTasks, 
      icon: ClipboardList, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50 border-indigo-100', 
      trend: `${completionRate}% completed overall`,
      onClick: () => navigate('/tasks')
    },
    { 
      label: 'In Progress', 
      value: inProgress, 
      icon: Clock, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 border-blue-100', 
      trend: 'Active work items',
      onClick: () => navigate('/tasks')
    },
    { 
      label: 'Completed', 
      value: completed, 
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 border-emerald-100', 
      trend: `+${completed} deliverables done`,
      onClick: () => navigate('/tasks')
    },
    { 
      label: 'Overdue', 
      value: overdue, 
      icon: AlertCircle, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50 border-rose-100', 
      trend: overdue > 0 ? 'Requires immediate action' : 'All clear & on schedule',
      highlight: overdue > 0,
      onClick: () => navigate('/tasks')
    },
  ];

  const formatDueDate = (dateStr: string) => {
    try {
      const d = parseISO(dateStr);
      if (isToday(d)) return 'Today · ' + format(d, 'h:mm a');
      if (isTomorrow(d)) return 'Tomorrow · ' + format(d, 'h:mm a');
      return format(d, 'MMM d, h:mm a');
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
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
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

  const handleQuickStatusChange = (e: React.MouseEvent, taskId: string, newStatus: Status) => {
    e.stopPropagation();
    updateTask(taskId, { status: newStatus });
    addToast(`Status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {greeting}, Admin 👋
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200/60">
              Business Suite
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {todayFormatted} · Here's what's happening with your team today.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Task
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            onClick={stat.onClick}
            className={cn(
              "bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer group hover:shadow-md",
              stat.highlight 
                ? "border-rose-200 hover:border-rose-300 bg-gradient-to-b from-white to-rose-50/20" 
                : "border-slate-200/70 hover:border-slate-300 shadow-xs"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className={cn("p-2.5 rounded-xl border transition-transform group-hover:scale-105", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="truncate">{stat.trend}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Section: Today's Focus & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Focus Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today's Focus</h2>
                <p className="text-xs text-slate-500 mt-0.5">High-priority operational overview</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-100 text-primary-700">
                Live
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-6">
              
              {/* Progress split bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span>Workload Progress</span>
                  <span className="text-primary-600">{completionRate}% Done</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div style={{ width: `${totalTasks > 0 ? (completed / totalTasks) * 100 : 0}%` }} className="bg-emerald-500" title="Completed" />
                  <div style={{ width: `${totalTasks > 0 ? (inProgress / totalTasks) * 100 : 0}%` }} className="bg-blue-500" title="In Progress" />
                  <div style={{ width: `${totalTasks > 0 ? (pending / totalTasks) * 100 : 0}%` }} className="bg-amber-400" title="To Do" />
                  <div style={{ width: `${totalTasks > 0 ? (overdue / totalTasks) * 100 : 0}%` }} className="bg-rose-500" title="Overdue" />
                </div>
              </div>

              {/* Status breakdown items */}
              <div className="space-y-2.5">
                <div 
                  onClick={() => navigate('/tasks')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/60 border border-transparent hover:border-rose-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100"></span>
                    Overdue tasks
                  </div>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", overdue > 0 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600")}>
                    {overdue}
                  </span>
                </div>

                <div 
                  onClick={() => navigate('/tasks')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-100"></span>
                    Tasks to do / pending
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {pending}
                  </span>
                </div>

                <div 
                  onClick={() => navigate('/tasks')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100"></span>
                    Tasks in progress
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {inProgress}
                  </span>
                </div>

                <div 
                  onClick={() => navigate('/tasks')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                    Tasks completed
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {completed}
                  </span>
                </div>
              </div>

              {/* Urgent Attention Highlight Card */}
              {urgentTask && (
                <div className="mt-auto pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      Urgent Attention
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">Action needed</span>
                  </div>

                  <div 
                    onClick={() => setSelectedTask(urgentTask)}
                    className="p-4 rounded-xl bg-gradient-to-br from-rose-50/60 to-red-50/30 border border-rose-200/80 hover:border-rose-300 transition-all cursor-pointer group shadow-xs"
                  >
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                      {urgentTask.title}
                    </h4>

                    <div className="mt-2.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Assigned</span>
                        <span className="font-semibold text-slate-800">{urgentTask.assignedToName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Due</span>
                        <span className={cn("font-semibold", urgentTask.status === 'OVERDUE' ? "text-rose-600 font-bold" : "text-slate-800")}>
                          {formatDueDate(urgentTask.deadline)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-rose-100/80 flex items-center justify-between">
                      {getPriorityBadge(urgentTask.priority)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(urgentTask);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 group-hover:text-rose-800 transition-colors"
                      >
                        View Task <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Tasks</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status of your active workflows</p>
              </div>
              <button 
                onClick={() => navigate('/tasks')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View all tasks <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Task Name</th>
                    <th className="px-4 py-3.5">Assignee</th>
                    <th className="px-4 py-3.5">Priority</th>
                    <th className="px-4 py-3.5">Due Date</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Task title */}
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            {task.assignedToName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-medium text-slate-700">{task.assignedToName}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={cn(
                          "text-xs font-medium",
                          task.status === 'OVERDUE' ? "text-rose-600 font-semibold" : "text-slate-600"
                        )}>
                          {formatDueDate(task.deadline)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>

                      {/* Quick action button */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {task.status !== 'Completed' ? (
                          <button
                            onClick={(e) => handleQuickStatusChange(e, task.id, 'Completed')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200/60"
                            title="Quick mark complete"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Done
                          </button>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">
                            Completed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {recentTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No tasks yet. Click "+ Create Task" to start organizing your business workflows.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
              <span>Showing top {recentTasks.length} active tasks</span>
              <button 
                onClick={() => navigate('/tasks')}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Go to Tasks Page →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Slide-over Task Details Drawer */}
      <TaskDetailsDrawer
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setSelectedTask(null);
          setEditingTask(task);
        }}
      />

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen || Boolean(editingTask)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask || undefined}
      />

    </div>
  );
}
