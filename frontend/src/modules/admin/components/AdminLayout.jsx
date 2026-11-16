import { useState } from 'react';
import { CheckCheck, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';



const TAB_ROUTES = {
  dashboard: PATHS.ADMIN_DASHBOARD,
  'create-task': PATHS.ADMIN_CREATE_TASK,
  'team-members': PATHS.ADMIN_TEAM_MEMBERS,
  'manage-tasks': PATHS.ADMIN_MANAGE_TASK,
};


export default function AdminLayout({ activeKey = 'dashboard', onNavigate, children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

const handleNavigate = (key) => {
  setOpen(false);
  if (TAB_ROUTES[key]) navigate(TAB_ROUTES[key]);  
  onNavigate?.(key);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <CheckCheck className="h-4 w-4" />
        </span>
        <h1 className="text-lg font-semibold text-slate-900">TaskBuddy</h1>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200 lg:block">
          <Sidebar activeKey={activeKey} onNavigate={handleNavigate} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 shadow-xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar activeKey={activeKey} onNavigate={handleNavigate} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
