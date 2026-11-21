import { ClipboardCheck, LayoutDashboard, PlusSquare, Users } from 'lucide-react';
import AppLayout from '../../../shared/components/layout/AppLayout';
import { PATHS } from '../../../routes/paths';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: PATHS.ADMIN_DASHBOARD },
  { key: 'manage-tasks', label: 'Manage Tasks', icon: ClipboardCheck, path: PATHS.ADMIN_MANAGE_TASK },
  { key: 'create-task', label: 'Create Task', icon: PlusSquare, path: PATHS.ADMIN_CREATE_TASK },
  { key: 'team-members', label: 'Team Members', icon: Users, path: PATHS.ADMIN_TEAM_MEMBERS },
];

export default function AdminLayout({ activeKey = 'dashboard', children }) {
  return (
    <AppLayout navItems={NAV_ITEMS} activeKey={activeKey}>
      {children}
    </AppLayout>
  );
}
