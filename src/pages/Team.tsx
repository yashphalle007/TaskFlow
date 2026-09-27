import React, { useState } from 'react';
import { useMembers, useTasks } from '@/hooks/useData';
import { 
  Mail, 
  Briefcase, 
  Plus, 
  Users, 
  X, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';

export default function Team() {
  const { members, addMember } = useMembers();
  const { tasks } = useTasks();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Operations');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getMemberStats = (memberId: string) => {
    const memberTasks = tasks.filter(t => t.assignedTo === memberId);
    const completed = memberTasks.filter(t => t.status === 'Completed').length;
    const pending = memberTasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
    const overdue = memberTasks.filter(t => t.status === 'OVERDUE').length;
    const total = memberTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, overdue, percentage };
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!role.trim()) errs.role = 'Role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please provide valid team member details', 'error');
      return;
    }
    
    addMember({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      avatar: name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    });

    addToast(`${name.trim()} added to your team`, 'success');
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setRole('Operations');
    setErrors({});
  };

  // Avatar pastel backgrounds
  const avatarColors = [
    'from-indigo-600 to-blue-500',
    'from-emerald-600 to-teal-500',
    'from-amber-600 to-orange-500',
    'from-rose-600 to-pink-500',
    'from-purple-600 to-indigo-500',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {members.length} Active Staff
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track workload distribution, employee deliverables, and productivity metrics.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Member
        </button>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {members.map((member, index) => {
          const stats = getMemberStats(member.id);
          const gradient = avatarColors[index % avatarColors.length];

          return (
            <div 
              key={member.id} 
              className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
            >
              {/* Member profile header */}
              <div className="p-6 border-b border-slate-100 flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-tr text-white flex items-center justify-center text-lg font-bold shadow-md flex-shrink-0 group-hover:scale-105 transition-transform",
                  gradient
                )}>
                  {member.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 truncate">{member.name}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </div>

                  <div className="flex items-center text-xs font-medium text-slate-500 mt-1">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span className="truncate">{member.role}</span>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <a href={`mailto:${member.email}`} className="truncate hover:text-primary-600 transition-colors">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Workload Stats & Progress bar */}
              <div className="p-6 bg-slate-50/50 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Tasks</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{stats.total}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Completed</p>
                    <p className="text-base font-bold text-emerald-600 mt-0.5">{stats.completed}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pending</p>
                    <p className="text-base font-bold text-amber-600 mt-0.5">{stats.pending}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-600">Completion Track Record</span>
                    <span className="text-primary-600">{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-700",
                        stats.percentage >= 80 ? "bg-emerald-500" : stats.percentage >= 50 ? "bg-indigo-500" : "bg-amber-500"
                      )}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={`https://wa.me/?text=Hello%20${encodeURIComponent(member.name)}%2C%20checking%20in%20on%20TaskFlow%20assignments.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200/60"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  <button
                    onClick={() => navigate('/tasks')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View Assigned Tasks <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Add Team Member</h2>
                  <p className="text-xs text-slate-500">Add an employee to delegate workflows</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={cn(
                    "w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium",
                    errors.name ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                  )}
                  placeholder="e.g. Suresh Verma"
                  autoFocus
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={cn(
                    "w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium",
                    errors.email ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                  )}
                  placeholder="e.g. suresh@taskflow.in"
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Role / Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-slate-800"
                >
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Sales Lead">Sales Lead</option>
                  <option value="Accountant & Billing">Accountant & Billing</option>
                  <option value="Warehouse Supervisor">Warehouse Supervisor</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Marketing Specialist">Marketing Specialist</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm shadow-primary-600/30 transition-all active:scale-95"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
