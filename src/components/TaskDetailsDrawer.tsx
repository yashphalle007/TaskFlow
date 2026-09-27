import React, { useState } from 'react';
import { Task, Status } from '@/types';
import { useTasks } from '@/hooks/useData';
import { useToast } from '@/components/ToastProvider';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  ChevronRight,
  ArrowUpRight,
  Check
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

interface TaskDetailsDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskDetailsDrawer({ task, isOpen, onClose, onEdit }: TaskDetailsDrawerProps) {
  const { updateTask, deleteTask } = useTasks();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleStatusChange = (newStatus: Status) => {
    updateTask(task.id, { status: newStatus });
    addToast(`Task marked as ${newStatus}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
      addToast('Task deleted successfully');
      onClose();
    }
  };

  const formatDeadline = (dateStr: string) => {
    try {
      const d = parseISO(dateStr);
      const timeStr = format(d, 'h:mm a');
      if (isToday(d)) return `Today, ${timeStr}`;
      if (isTomorrow(d)) return `Tomorrow, ${timeStr}`;
      return `${format(d, 'MMM d, yyyy')} · ${timeStr}`;
    } catch {
      return dateStr;
    }
  };

  const isOverdue = task.status === 'OVERDUE';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200/80 flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-200/70 text-slate-700">
                TF-{task.id.slice(-4).toUpperCase()}
              </span>
              
              {/* Priority badge */}
              {task.priority === 'HIGH' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  High Priority
                </span>
              )}
              {task.priority === 'MEDIUM' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Medium Priority
                </span>
              )}
              {task.priority === 'LOW' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Low Priority
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Overdue Alert Banner */}
            {isOverdue && (
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-rose-900 uppercase tracking-wider">Overdue Attention Required</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    This task passed its deadline ({formatDistanceToNow(parseISO(task.deadline), { addSuffix: true })}). Please expedite completion or reschedule.
                  </p>
                </div>
              </div>
            )}

            {/* Task Title */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {task.title}
              </h2>
            </div>

            {/* Status Stepper / Quick switcher */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
                Workflow Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['To Do', 'In Progress', 'Completed'] as Status[]).map((statusOption) => {
                  const isActive = task.status === statusOption;
                  return (
                    <button
                      key={statusOption}
                      onClick={() => handleStatusChange(statusOption)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border",
                        isActive
                          ? statusOption === 'Completed'
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : statusOption === 'In Progress'
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-800 text-white border-slate-800 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200/70 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {statusOption}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Description & Notes
              </label>
              <div className="p-4 rounded-xl bg-white border border-slate-200/70 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[90px]">
                {task.description ? task.description : (
                  <span className="text-slate-400 italic">No additional description provided.</span>
                )}
              </div>
            </div>

            {/* Metadata Properties Grid */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Task Attributes
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Assignee Card */}
                <div className="p-3.5 rounded-xl border border-slate-200/60 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {task.assignedToName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400 uppercase">Assigned To</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{task.assignedToName}</p>
                  </div>
                </div>

                {/* Deadline Card */}
                <div className={cn(
                  "p-3.5 rounded-xl border flex items-center gap-3",
                  isOverdue ? "bg-rose-50/40 border-rose-200" : "bg-white border-slate-200/60"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    isOverdue ? "bg-rose-100 text-rose-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400 uppercase">Deadline</p>
                    <p className={cn("text-sm font-semibold truncate", isOverdue ? "text-rose-600" : "text-slate-900")}>
                      {formatDeadline(task.deadline)}
                    </p>
                  </div>
                </div>

                {/* Created Date */}
                <div className="p-3.5 rounded-xl border border-slate-200/60 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400 uppercase">Created Date</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {format(parseISO(task.createdAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Current Status Badge display */}
                <div className="p-3.5 rounded-xl border border-slate-200/60 bg-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400 uppercase">Current Status</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{task.status}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
            {task.status !== 'Completed' ? (
              <button
                onClick={() => handleStatusChange('Completed')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Complete
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange('In Progress')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Reopen Task
              </button>
            )}

            <button
              onClick={() => onEdit(task)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Full Edit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
