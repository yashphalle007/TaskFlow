import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  CheckSquare2, 
  Plus, 
  Bell, 
  Search,
  Building,
  ChevronDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTasks } from '@/hooks/useData';
import TaskModal from '@/components/TaskModal';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare, badgeKey: 'overdue' },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { tasks } = useTasks();
  const location = useLocation();

  const overdueCount = tasks.filter(t => t.status === 'OVERDUE').length;
  const overdueTasks = tasks.filter(t => t.status === 'OVERDUE');

  // Derive current page title
  const currentNav = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="flex h-screen bg-slate-50/70 font-sans text-slate-800 antialiased overflow-hidden">
      
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern SaaS Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-sm",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary-600 p-2 rounded-xl text-white shadow-md shadow-primary-600/30">
              <CheckSquare2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900">TaskFlow</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200/60">
                  MVP
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400">Small Business OS</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Switcher Pill */}
        <div className="p-3 mx-3 my-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors cursor-pointer">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              AT
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Apex Trading Co.</p>
              <p className="text-[10px] text-slate-500 truncate">Small Business Plan</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </div>

        {/* Quick Action Button */}
        <div className="px-3 mb-2">
          <button
            onClick={() => setIsQuickCreateOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm shadow-primary-600/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            New Task
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-primary-50/90 text-primary-700 shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 transition-colors" />
                <span>{item.name}</span>
              </div>

              {item.badgeKey === 'overdue' && overdueCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700" title={`${overdueCount} overdue tasks`}>
                  {overdueCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AD
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">Admin User</span>
              <span className="text-[11px] text-slate-500 truncate">admin@taskflow.in</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Global Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{currentNav.name}</span>
              <span>/</span>
              <span>Overview</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell with Overdue Alert Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {overdueCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in zoom-in-95 duration-100">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">Notifications & Alerts</h4>
                    {overdueCount > 0 && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {overdueCount} Overdue
                      </span>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 py-1">
                    {overdueTasks.length > 0 ? (
                      overdueTasks.slice(0, 4).map(task => (
                        <div key={task.id} className="p-3 hover:bg-rose-50/50 transition-colors">
                          <p className="text-xs font-semibold text-slate-900 truncate">{task.title}</p>
                          <p className="text-[10px] text-rose-600 font-medium mt-0.5">
                            Assigned to {task.assignedToName} · OVERDUE
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No urgent alerts. All tasks on schedule!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Create Task button in Header */}
            <button
              onClick={() => setIsQuickCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Create Task</span>
            </button>
          </div>

        </header>

        {/* Scrollable Workspace Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

      </div>

      {/* Global Quick Task Creation Modal */}
      <TaskModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />

    </div>
  );
}
