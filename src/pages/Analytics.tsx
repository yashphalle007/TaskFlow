import React, { useMemo } from 'react';
import { useTasks, useMembers } from '@/hooks/useData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Target,
  BarChart3,
  Calendar
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Analytics() {
  const { tasks } = useTasks();
  const { members } = useMembers();

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = tasks.filter(t => t.status === 'OVERDUE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const onTimeRate = (totalTasks - overdueTasks) > 0 ? Math.round(((totalTasks - overdueTasks) / totalTasks) * 100) : 100;

  // Donut chart status data
  const statusData = useMemo(() => {
    return [
      { name: 'Completed', value: completedTasks, color: '#10b981' },
      { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
      { name: 'To Do', value: todoTasks, color: '#f59e0b' },
      { name: 'Overdue', value: overdueTasks, color: '#ef4444' },
    ].filter(d => d.value > 0);
  }, [completedTasks, inProgressTasks, todoTasks, overdueTasks]);

  // Productivity per team member
  const productivityData = useMemo(() => {
    return members.map(m => {
      const mTasks = tasks.filter(t => t.assignedTo === m.id);
      const completed = mTasks.filter(t => t.status === 'Completed').length;
      const pending = mTasks.filter(t => t.status === 'In Progress' || t.status === 'To Do').length;
      const overdue = mTasks.filter(t => t.status === 'OVERDUE').length;
      return {
        name: m.name.split(' ')[0],
        Completed: completed,
        Pending: pending,
        Overdue: overdue,
        total: mTasks.length
      };
    });
  }, [members, tasks]);

  // Priority distribution data
  const priorityData = useMemo(() => {
    const high = tasks.filter(t => t.priority === 'HIGH').length;
    const med = tasks.filter(t => t.priority === 'MEDIUM').length;
    const low = tasks.filter(t => t.priority === 'LOW').length;
    return [
      { name: 'High', count: high, fill: '#f43f5e' },
      { name: 'Medium', count: med, fill: '#f59e0b' },
      { name: 'Low', count: low, fill: '#64748b' },
    ];
  }, [tasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Productivity Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time performance metrics and workflow turnaround times.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last 30 Days</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{completionRate}%</p>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">On-Time Delivery</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{onTimeRate}%</p>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
            <span>{totalTasks - overdueTasks} tasks delivered on schedule</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Workflows</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{inProgressTasks + todoTasks}</p>
          <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
            <span>{inProgressTasks} currently in progress</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Tasks</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-600 mt-2 tracking-tight">{overdueTasks}</p>
          <div className="mt-3 flex items-center text-xs text-rose-600 font-medium">
            <span>{overdueTasks > 0 ? 'Requires owner intervention' : 'Zero delays'}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Task Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Task Status Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Workflow stages breakdown</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">{totalTasks} Total</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No task data available</p>
            )}
          </div>
        </div>

        {/* Team Productivity Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Employee Output Comparison</h2>
              <p className="text-xs text-slate-500 mt-0.5">Completed vs Pending deliverables</p>
            </div>
            <span className="text-xs font-semibold text-primary-600">{members.length} Members</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={36} />
                <Bar dataKey="Pending" stackId="a" fill="#f59e0b" barSize={36} />
                <Bar dataKey="Overdue" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Team Productivity Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Team Workload & Output Leaderboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">Individual performance breakdown</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <Award className="w-3.5 h-3.5" />
            Productivity Tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-4 py-3.5">Assigned</th>
                <th className="px-4 py-3.5">Completed</th>
                <th className="px-4 py-3.5">Pending</th>
                <th className="px-4 py-3.5">Overdue</th>
                <th className="px-6 py-3.5 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {members.map((member) => {
                const mTasks = tasks.filter(t => t.assignedTo === member.id);
                const completed = mTasks.filter(t => t.status === 'Completed').length;
                const pending = mTasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
                const overdue = mTasks.filter(t => t.status === 'OVERDUE').length;
                const total = mTasks.length;
                const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{total}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600">{completed}</td>
                    <td className="px-4 py-3.5 font-semibold text-amber-600">{pending}</td>
                    <td className="px-4 py-3.5 font-semibold text-rose-600">{overdue}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              rate >= 75 ? "bg-emerald-500" : rate >= 50 ? "bg-primary-500" : "bg-amber-500"
                            )}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-8">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
