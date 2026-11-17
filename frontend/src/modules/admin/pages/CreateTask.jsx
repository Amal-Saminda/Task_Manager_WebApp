
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

import { INITIAL_TASK, PRIORITY_DATA } from '../data/taskFormData';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';

const validate = (task) => {
  const errors = {};

  if (!task.title.trim()) errors.title = 'Task title is required';
  if (!task.description.trim()) errors.description = 'Description is required';
  if (!task.dueDate) errors.dueDate = 'Select a due date';

  if (task.assignedTo.length === 0) {
    errors.assignedTo = 'Task not assigned to any member';
  }

  if (task.todoCheckList.length === 0) {
    errors.todoCheckList = 'Add at least one todo item';
  }

  return errors;
};

export default function CreateTask() {

  const [task, setTask] = useState(INITIAL_TASK);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => {
    setTask((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setCreated(false);
  };

  const clearData = () => {
    setTask({ ...INITIAL_TASK });
    setErrors({});
  };

  const createTask = async () => {
    setLoading(true);

    try {

      const todolist = task.todoCheckList.map((item) => ({
        text: item,
        completed: false
      }));

      const payload = {
        ...task,
        dueDate: new Date(task.dueDate).toISOString(),
        todoCheckList: todolist,
      };

      const response = await axiosInstance.post(
        API_PATHS.TASKS.CREATE_TASK,
        payload
      );

      console.log('Created Task:', response.data);

      setCreated(true);
      clearData();

    } catch (error) {

      console.error(
        'Error creating task:',
        error.response?.data || error.message
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate(task);
    setErrors(found);

    if (Object.keys(found).length > 0) return;

    await createTask();
  };

  return (
    <AdminLayout activeKey="create-task">

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-4xl space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6"
      >

        <h2 className="text-xl font-semibold text-slate-900">
          Create Task
        </h2>

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

          <Field label="Assign To" error={errors.assignedTo}>
            <AssignMembers
              selectedIds={task.assignedTo}
              onChange={(ids) => setField('assignedTo', ids)}
              hasError={Boolean(errors.assignedTo)}
            />
          </Field>

        </div>

        <Field label="TODO Checklist" error={errors.todoCheckList}>
          <TodoListInput
            items={task.todoCheckList}
            onChange={(list) => setField('todoCheckList', list)}
          />
        </Field>

        <Field label="Add Attachments">
          <AttachmentsInput
            items={task.attachments}
            onChange={(list) => setField('attachments', list)}
          />
        </Field>

        <SubmitButton disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </SubmitButton>

      </form>

    </AdminLayout>
  );
}
