import { ClipboardCheck, LayoutDashboard } from 'lucide-react';
import AppLayout from '../../../shared/components/layout/AppLayout';
import { PATHS } from '../../../routes/paths';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: PATHS.USER_DASHBOARD },
  { key: 'my-tasks', label: 'My Tasks', icon: ClipboardCheck, path: PATHS.USER_MY_TASKS },
];

export default function UserLayout({ activeKey = 'dashboard', children }) {
  return (
    <AppLayout navItems={NAV_ITEMS} activeKey={activeKey}>
      {children}
    </AppLayout>
  );
}
