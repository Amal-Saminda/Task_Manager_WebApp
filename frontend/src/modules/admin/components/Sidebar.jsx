import { ClipboardCheck, LayoutDashboard, LogOut, PlusSquare, Users } from 'lucide-react';
import { adminProfile } from '../data/dashboardData';
import useAuth from '../../../hooks/useAuth';

// Only "Dashboard" has a page for now. The other tabs are labels only (no UI yet).
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, ready: true },
  { key: 'manage-tasks', label: 'Manage Tasks', icon: ClipboardCheck, ready: true },
  { key: 'create-task', label: 'Create Task', icon: PlusSquare, ready: true },
  { key: 'team-members', label: 'Team Members', icon: Users, ready: true },
];

function Avatar({ name, src }) {
  if (src) {
    return <img src={src} alt={name} className="h-24 w-24 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-3xl font-semibold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Sidebar({ activeKey = 'dashboard', onNavigate }) {
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-col items-center px-4 pb-6 pt-6">
        <Avatar name={adminProfile.name} src={adminProfile.avatar} />
        <span className="-mt-2.5 rounded bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
          {adminProfile.role}
        </span>
        <p className="mt-3 text-base font-semibold text-slate-900">{adminProfile.name}</p>
        <p className="text-xs text-slate-500">{adminProfile.email}</p>
      </div>

      <nav className="flex-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon, ready }) => {
          const active = key === activeKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => ready && onNavigate?.(key)}
              aria-current={active ? 'page' : undefined}
              title={ready ? undefined : 'Coming soon'}
              className={`flex w-full items-center gap-3.5 border-r-[3px] px-6 py-3.5 text-left text-[15px] transition ${
                active
                  ? 'border-blue-600 bg-blue-50 font-medium text-blue-600'
                  : 'border-transparent text-slate-700 hover:bg-slate-50'
              } ${ready ? '' : 'cursor-default'}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3.5 border-r-[3px] border-transparent px-6 py-3.5 text-left text-[15px] text-slate-700 transition hover:bg-slate-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>
    </div>
  );
}
