import React, { useState, useEffect } from 'react';
import { useTasks, useMembers } from '@/hooks/useData';
import { useToast } from '@/components/ToastProvider';
import { X, Calendar, Clock, AlertCircle, Sparkles, Check } from 'lucide-react';
import { Priority, Status, Task } from '@/types';
import { format, parseISO, addDays, setHours, setMinutes } from 'date-fns';
import { cn } from '@/utils/cn';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { addTask, updateTask } = useTasks();
  const { members } = useMembers();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('17:00');
  const [status, setStatus] = useState<Status>('To Do');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setAssignedTo(task.assignedTo);
      setPriority(task.priority);
      setStatus(task.status);
      try {
        const d = parseISO(task.deadline);
        setDeadlineDate(format(d, 'yyyy-MM-dd'));
        setDeadlineTime(format(d, 'HH:mm'));
      } catch {
        const now = new Date();
        setDeadlineDate(format(now, 'yyyy-MM-dd'));
        setDeadlineTime('17:00');
      }
    } else {
      setTitle('');
      setDescription('');
      setAssignedTo(members[0]?.id || '1');
      setPriority('MEDIUM');
      setStatus('To Do');
      const now = new Date();
      setDeadlineDate(format(now, 'yyyy-MM-dd'));
      setDeadlineTime('17:00');
    }
    setErrors({});
  }, [task, isOpen, members]);

  // Keyboard shortcut: Esc to close, Ctrl/Cmd + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, assignedTo, deadlineDate, deadlineTime, priority, status]);

  if (!isOpen) return null;

  const setQuickDeadline = (type: 'today' | 'tomorrow' | '3days') => {
    const now = new Date();
    let target = now;
    if (type === 'today') {
      target = setMinutes(setHours(now, 17), 0);
    } else if (type === 'tomorrow') {
      target = setMinutes(setHours(addDays(now, 1), 17), 0);
    } else if (type === '3days') {
      target = setMinutes(setHours(addDays(now, 3), 17), 0);
    }
    setDeadlineDate(format(target, 'yyyy-MM-dd'));
    setDeadlineTime(format(target, 'HH:mm'));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (!assignedTo) newErrors.assignedTo = 'Please select a team member';
    if (!deadlineDate) newErrors.deadlineDate = 'Please specify a deadline date';
    if (!deadlineTime) newErrors.deadlineTime = 'Please specify a deadline time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    const member = members.find((m) => m.id === assignedTo) || members[0];
    const deadlineStr = `${deadlineDate}T${deadlineTime}:00`;
    const deadlineObj = new Date(deadlineStr);

    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        assignedToName: member.name,
        priority,
        status: status === 'OVERDUE' ? 'To Do' : status,
        deadline: deadlineObj.toISOString(),
      });
      addToast('Task updated successfully', 'success');
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        assignedTo: member.id,
        assignedToName: member.name,
        priority,
        status: 'To Do',
        deadline: deadlineObj.toISOString(),
      });
      addToast('Task created successfully', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-xs text-slate-500">
                {task ? 'Update details, assignment or deadline' : 'Assign to your team member with deadline'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={cn(
                "w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 font-medium",
                errors.title 
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
              )}
              placeholder="e.g. Dispatch GST invoice to client"
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Description / Instructions (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400 resize-none h-24"
              placeholder="Add key notes, invoice numbers, or client contacts..."
            />
          </div>

          {/* Assignee & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Assign Employee <span className="text-rose-500">*</span>
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-800"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        "py-2 px-1 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1",
                        isSelected
                          ? p === 'HIGH'
                            ? "bg-rose-50 text-rose-700 border-rose-300 shadow-xs"
                            : p === 'MEDIUM'
                            ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs"
                            : "bg-slate-100 text-slate-800 border-slate-300 shadow-xs"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        p === 'HIGH' ? "bg-rose-500" : p === 'MEDIUM' ? "bg-amber-500" : "bg-slate-400"
                      )}></span>
                      {p === 'HIGH' ? 'High' : p === 'MEDIUM' ? 'Med' : 'Low'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deadline with Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Deadline <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDeadline('today')}
                  className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Today 5 PM
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline('tomorrow')}
                  className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline('3days')}
                  className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  +3 Days
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
                />
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Status selector (if editing) */}
          {task && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Current Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                {status === 'OVERDUE' && <option value="OVERDUE">OVERDUE</option>}
              </select>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">Ctrl+Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm shadow-primary-600/30 transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
