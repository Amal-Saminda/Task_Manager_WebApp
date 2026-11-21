import { LogOut } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { ROLES } from '../../../routes/paths';

function ProfileAvatar({ name = '', src }) {
  if (src) {
    return <img src={src} alt={name} className="h-24 w-24 rounded-full object-cover" />;
  }
  return (
    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-3xl font-semibold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

// navItems = [{ key, label, icon, path }]
export default function Sidebar({ navItems, activeKey, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-col items-center px-4 pb-6 pt-6">
        <ProfileAvatar name={user?.name} src={user?.profileImageUrl} />
        <span className="-mt-2.5 rounded bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
          {user?.role === ROLES.ADMIN ? 'Admin' : 'Member'}
        </span>
        <p className="mt-3 text-base font-semibold text-slate-900">{user?.name}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>

      <nav className="flex-1">
        {navItems.map(({ key, label, icon: Icon }) => {
          const active = key === activeKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3.5 border-r-[3px] px-6 py-3.5 text-left text-[15px] transition ${
                active
                  ? 'border-blue-600 bg-blue-50 font-medium text-blue-600'
                  : 'border-transparent text-slate-700 hover:bg-slate-50'
              }`}
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
