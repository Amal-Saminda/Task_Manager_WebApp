// STATIC placeholder data for the Create Task form — UI only.
// Replace TEAM_MEMBERS with API data later.

export const PRIORITY_DATA = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

export const TEAM_MEMBERS = [
  { id: 'm1', name: 'Dustin', email: 'dustin@taskbuddy.com', avatar: '' },
  { id: 'm2', name: 'Adam', email: 'adam@taskbuddy.com', avatar: '' },
  { id: 'm3', name: 'Alex', email: 'alex@taskbuddy.com', avatar: '' },
];

export const INITIAL_TASK = {
  title: '',
  description: '',
  priority: 'Low',
  dueDate: '',
  assignTo: [], // member ids
  todoChecklist: [], // strings
  attachments: [], // strings (links)
};
