import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import Field from '../components/createTask/Field';
import SelectDropdown from '../components/createTask/SelectDropdown';
import AssignMembers from '../components/createTask/AssignMembers';
import TodoListInput from '../components/createTask/TodoListInput';
import AttachmentsInput from '../components/createTask/AttachmentsInput';
import { inputClass } from '../components/createTask/formStyles';
import SubmitButton from '../../../shared/components/form/SubmitButton';
import { INITIAL_TASK, PRIORITY_DATA, TEAM_MEMBERS } from '../data/taskFormData';

const validate = (task) => {
  const errors = {};
  if (!task.title.trim()) errors.title = 'Task title is required';
  if (!task.description.trim()) errors.description = 'Description is required';
  if (!task.dueDate) errors.dueDate = 'Select a due date';
  if (task.assignTo.length === 0) errors.assignTo = 'Task not assigned to any member';
  if (task.todoChecklist.length === 0) errors.todoChecklist = 'Add at least one todo item';
  return errors;
};

export default function CreateTask() {
  const [task, setTask] = useState(INITIAL_TASK);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(false);

  const setField = (key, value) => {
    setTask((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setCreated(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate(task);
    setErrors(found);
    if (Object.keys(found).length) return;

    // TODO: call the create-task API here (task = form data).
    setCreated(true);
    setTask(INITIAL_TASK);
  };

  return (
    <AdminLayout activeKey="create-task">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-4xl space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-xl font-semibold text-slate-900">Create Task</h2>

        {created && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Task created successfully.
          </div>
        )}

        <Field label="Task Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            type="text"
            placeholder="Create App UI"
            value={task.title}
            onChange={(e) => setField('title', e.target.value)}
            className={`${inputClass(errors.title)} h-11`}
          />
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description}>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe task"
            value={task.description}
            onChange={(e) => setField('description', e.target.value)}
            className={`${inputClass(errors.description)} resize-none py-3`}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Priority" htmlFor="priority">
            <SelectDropdown
              id="priority"
              options={PRIORITY_DATA}
              value={task.priority}
              onChange={(v) => setField('priority', v)}
            />
          </Field>

          <Field label="Due Date" htmlFor="dueDate" error={errors.dueDate}>
            <input
              id="dueDate"
              type="date"
              value={task.dueDate}
              onChange={(e) => setField('dueDate', e.target.value)}
              className={`${inputClass(errors.dueDate)} h-11`}
            />
          </Field>

          <Field label="Assign To" error={errors.assignTo}>
            <AssignMembers
              members={TEAM_MEMBERS}
              selectedIds={task.assignTo}
              onChange={(ids) => setField('assignTo', ids)}
              hasError={Boolean(errors.assignTo)}
            />
          </Field>
        </div>

        <Field label="TODO Checklist" error={errors.todoChecklist}>
          <TodoListInput items={task.todoChecklist} onChange={(list) => setField('todoChecklist', list)} />
        </Field>

        <Field label="Add Attachments">
          <AttachmentsInput items={task.attachments} onChange={(list) => setField('attachments', list)} />
        </Field>

        <SubmitButton>Create Task</SubmitButton>
      </form>
    </AdminLayout>
  );
}
