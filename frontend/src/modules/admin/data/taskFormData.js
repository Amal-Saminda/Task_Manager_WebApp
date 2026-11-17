// STATIC placeholder data for the Create Task form — UI only.
// Replace TEAM_MEMBERS with API data later.

export const PRIORITY_DATA = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

export const INITIAL_TASK = {
  title: '',
  description: '',
  priority: 'Low',
  dueDate: '',
  assignedTo: [], // member ids
  todoCheckList: [], // strings
  attachments: [], // strings (links)
};
