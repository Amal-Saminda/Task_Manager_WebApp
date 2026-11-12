// STATIC placeholder data — UI only. Replace with API data later.

export const adminProfile = {
  name: 'Mike',
  email: 'mike@taskbuddy.com',
  role: 'Admin',
  avatar: '', // empty -> initials fallback
};

export const tasks = [
  { id: 1, title: 'Design landing page', status: 'Pending', priority: 'High', dueDate: '2026-11-14' },
  { id: 2, title: 'Set up CI pipeline', status: 'In Progress', priority: 'Medium', dueDate: '2026-11-12' },
  { id: 3, title: 'Write API documentation', status: 'Pending', priority: 'Low', dueDate: '2026-11-18' },
  { id: 4, title: 'Fix login redirect bug', status: 'Completed', priority: 'High', dueDate: '2026-11-08' },
  { id: 5, title: 'Prepare sprint review', status: 'In Progress', priority: 'Medium', dueDate: '2026-11-13' },
];

// Summary numbers shown on the cards / charts (static)
export const summary = {
  total: 18,
  pending: 11,
  inProgress: 5,
  completed: 2,
};

export const priorityCounts = [
  { label: 'Low', value: 5 },
  { label: 'Medium', value: 6 },
  { label: 'High', value: 7 },
];
