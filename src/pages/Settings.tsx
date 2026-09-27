import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Bell, 
  Shield, 
  Database, 
  RotateCcw, 
  Download, 
  Check, 
  Save,
  Moon,
  Sun,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { useTasks } from '@/hooks/useData';
import { cn } from '@/utils/cn';

export default function Settings() {
  const { addToast } = useToast();
  const { resetToDefault, tasks } = useTasks();

  const [activeTab, setActiveTab] = useState<'general' | 'company' | 'data' | 'notifications'>('company');
  const [companyName, setCompanyName] = useState('Apex Industrial Trading Co.');
  const [ownerName, setOwnerName] = useState('Admin User');
  const [gstin, setGstin] = useState('27AADCS1234F1Z5');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [city, setCity] = useState('Mumbai, Maharashtra');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Company settings updated successfully', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and team members to initial demo state? Any custom tasks created will be replaced with clean demo data.')) {
      resetToDefault();
      addToast('Reset to demo data completed successfully', 'success');
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `taskflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Tasks exported to JSON', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure company credentials, manage demo data, and customize preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Settings Navigation and Body */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-100 p-4 space-y-1.5 bg-slate-50/50 flex-shrink-0">
          {[
            { id: 'company', label: 'Company Profile', icon: Building2 },
            { id: 'general', label: 'Preferences', icon: User },
            { id: 'data', label: 'Demo Data & Backup', icon: Database },
            { id: 'notifications', label: 'Alerts & WhatsApp', icon: Bell },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                  isActive
                    ? "bg-white text-primary-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary-600" : "text-slate-400")} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8">
          
          {/* TAB: Company Profile */}
          {activeTab === 'company' && (
            <form onSubmit={handleSave} className="space-y-5 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Company Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Details that appear on generated task flows and reports</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Company Legal Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Business Owner / Admin
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Operating City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-sm shadow-primary-600/30 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Save Company Profile
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB: Demo Data & Backup */}
          {activeTab === 'data' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Demo Data & Backup Tools</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designed for hackathon judges and evaluations. Reset or export application states in one click.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  Reset to Hackathon Demo Data
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Restores 11 realistic Indian small business tasks (GST invoices, client follow-ups, raw material suppliers) and 4 core employees with calculated overdue and active states.
                </p>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
                >
                  Reset Demo State Now
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Download className="w-4 h-4 text-slate-600" />
                  Export All Workflow Data
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Download a complete JSON snapshot of all active, overdue, and completed tasks for data backup or inspection.
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl shadow-xs transition-colors"
                >
                  Download JSON Backup
                </button>
              </div>
            </div>
          )}

          {/* TAB: General Preferences */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">General Workspace Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Personalize your dashboard experience</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Date & Timezone Format</h4>
                    <p className="text-xs text-slate-500">Standard IST (+05:30) Indian Standard Time</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                    Asia/Kolkata
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Overdue Task Automation</h4>
                    <p className="text-xs text-slate-500">Auto-calculate and highlight overdue items after deadline passes</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Alerts & WhatsApp */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Notifications & WhatsApp Bridge</h3>
                <p className="text-xs text-slate-500 mt-0.5">Automate alerts for small business staff</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900">Automated Daily Morning Digest</h4>
                  <p className="text-xs text-slate-500">Sends summary of today's focus tasks at 9:00 AM</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900">Instant Overdue Alerts</h4>
                  <p className="text-xs text-slate-500">Notifies manager whenever high priority task breaches deadline</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
