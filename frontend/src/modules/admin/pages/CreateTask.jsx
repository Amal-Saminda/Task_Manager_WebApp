
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import moment from 'moment';

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

import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';


const validate = (task) => {
  const errors = {};

  if (!task.title.trim()) {
    errors.title = 'Task title is required';
  }

  if (!task.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!task.dueDate) {
    errors.dueDate = 'Select a due date';
  }

  if (task.assignedTo.length === 0) {
    errors.assignedTo = 'Task not assigned to any member';
  }

  if (task.todoCheckList.length === 0) {
    errors.todoCheckList = 'Add at least one todo item';
  }

  return errors;
};


export default function CreateTask() {

  const navigate = useNavigate();
const [deleting, setDeleting] = useState(false); 

  // Get task ID from navigation state
  const location = useLocation();

  const taskId = location.state?.taskId;
  const isEditMode = Boolean(taskId);

  // Form states
  const [task, setTask] = useState({
    ...INITIAL_TASK,
    assignedTo: [...INITIAL_TASK.assignedTo],
    todoCheckList: [...INITIAL_TASK.todoCheckList],
    attachments: [...INITIAL_TASK.attachments],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Preserve existing checklist completion status
  const [originalChecklist, setOriginalChecklist] = useState([]);


  // Update individual form fields
  const setField = (key, value) => {
    setTask((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));

    setSuccessMessage('');
  };


  // Reset form
  const clearData = () => {
    setTask({
      ...INITIAL_TASK,
      assignedTo: [...INITIAL_TASK.assignedTo],
      todoCheckList: [...INITIAL_TASK.todoCheckList],
      attachments: [...INITIAL_TASK.attachments],
    });

    setErrors({});
    setOriginalChecklist([]);
    setSuccessMessage('');
  };


  // Get task details by ID
  const getTaskDetailsByID = async (id) => {

    setFetching(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASKS_BY_ID(id)
      );

      const taskInfo =
        response.data?.task ||
        response.data?.data?.task ||
        response.data;

      // Preserve existing checklist objects
      const checklist = taskInfo.todoCheckList || [];

      setOriginalChecklist(checklist);

      // Populate form fields
      setTask({
        title: taskInfo.title || '',
        description: taskInfo.description || '',
        priority: taskInfo.priority || 'Low',

        dueDate: taskInfo.dueDate
          ? moment(taskInfo.dueDate).format('YYYY-MM-DD')
          : '',

        assignedTo:
          taskInfo.assignedTo?.map((user) => user._id) || [],

        todoCheckList:
          checklist.map((item) => item.text),

        attachments: taskInfo.attachments || [],
      });

    } catch (error) {
      console.error(
        'Error fetching task details:',
        error.response?.data || error.message
      );
    } finally {
      setFetching(false);
    }
  };


  // Create payload
  const getTaskPayload = () => {

    const todoList = task.todoCheckList.map((item) => {

      // Find existing checklist item
      const existingItem = originalChecklist.find(
        (oldItem) => oldItem.text === item
      );

      return {
        text: item,
        completed: existingItem?.completed || false,
      };
    });

    return {
      ...task,
      dueDate: new Date(task.dueDate).toISOString(),
      todoCheckList: todoList,
    };
  };


  // Create new task
  const createTask = async () => {

    setLoading(true);

    try {
      const payload = getTaskPayload();

      const response = await axiosInstance.post(
        API_PATHS.TASKS.CREATE_TASK,
        payload
      );

      console.log('Created Task:', response.data);

      setSuccessMessage('Task created successfully!');

      clearData();

      setSuccessMessage('Task created successfully!');

    } catch (error) {

      console.error(
        'Error creating task:',
        error.response?.data || error.message
      );

    } finally {
      setLoading(false);
    }
  };


  // Update existing task
  const updateTask = async () => {

    setLoading(true);

    try {
      const payload = getTaskPayload();

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        payload
      );

      console.log('Updated Task:', response.data);

      setSuccessMessage('Task updated successfully!');

    } catch (error) {

      console.error(
        'Error updating task:',
        error.response?.data || error.message
      );

    } finally {
      setLoading(false);
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {

    e.preventDefault();

    const found = validate(task);

    setErrors(found);

    if (Object.keys(found).length > 0) {
      return;
    }

    if (isEditMode) {
      await updateTask();
    } else {
      await createTask();
    }
  };

  const DeleteTask = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this task? This action cannot be undone.'
  );

  if (!confirmed) return;

  setDeleting(true);

  try {
    const response = await axiosInstance.delete(
      API_PATHS.TASKS.DELETE_TASK(taskId)
    );

    console.log('Deleted Task:', response.data);

    alert('Task deleted successfully!');

    navigate('/admin/manage-tasks');

  } catch (error) {
    console.error(
      'Error deleting task:',
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message || 'Failed to delete task.'
    );

  } finally {
    setDeleting(false);
  }
};


  // Fetch task only when taskId changes
  useEffect(() => {

    if (taskId) {
      getTaskDetailsByID(taskId);
    }

  }, [taskId]);




  return (
    <AdminLayout activeKey="create-task">

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-4xl space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6"
      >

        {/* Page Title */}
        <h2 className="text-xl font-semibold text-slate-900">
          {isEditMode ? 'Update Task' : 'Create Task'}
        </h2>


        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}


        {/* Fetching Message */}
        {fetching && (
          <p className="text-sm text-gray-500">
            Loading task details...
          </p>
        )}


        {/* Task Title */}
        <Field
          label="Task Title"
          htmlFor="title"
          error={errors.title}
        >
          <input
            id="title"
            type="text"
            placeholder="Create App UI"
            value={task.title}
            onChange={(e) =>
              setField('title', e.target.value)
            }
            className={`${inputClass(errors.title)} h-11`}
          />
        </Field>


        {/* Description */}
        <Field
          label="Description"
          htmlFor="description"
          error={errors.description}
        >
          <textarea
            id="description"
            rows={4}
            placeholder="Describe task"
            value={task.description}
            onChange={(e) =>
              setField('description', e.target.value)
            }
            className={`${inputClass(errors.description)} resize-none py-3`}
          />
        </Field>


        {/* Priority / Due Date / Assign Members */}
        <div className="grid gap-4 sm:grid-cols-3">

          <Field label="Priority" htmlFor="priority">
            <SelectDropdown
              id="priority"
              options={PRIORITY_DATA}
              value={task.priority}
              onChange={(value) =>
                setField('priority', value)
              }
            />
          </Field>


          <Field
            label="Due Date"
            htmlFor="dueDate"
            error={errors.dueDate}
          >
            <input
              id="dueDate"
              type="date"
              value={task.dueDate}
              onChange={(e) =>
                setField('dueDate', e.target.value)
              }
              className={`${inputClass(errors.dueDate)} h-11`}
            />
          </Field>


          <Field
            label="Assign To"
            error={errors.assignedTo}
          >
            <AssignMembers
              selectedIds={task.assignedTo}
              onChange={(ids) =>
                setField('assignedTo', ids)
              }
              hasError={Boolean(errors.assignedTo)}
            />
          </Field>

        </div>


        {/* TODO Checklist */}
        <Field
          label="TODO Checklist"
          error={errors.todoCheckList}
        >
          <TodoListInput
            items={task.todoCheckList}
            onChange={(list) =>
              setField('todoCheckList', list)
            }
          />
        </Field>


        {/* Attachments */}
        <Field label="Add Attachments">
          <AttachmentsInput
            items={task.attachments}
            onChange={(list) =>
              setField('attachments', list)
            }
          />
        </Field>


        {/* Submit Button */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">

  {/* Delete Button */}
  {isEditMode && (
    <button
      type="button"
      onClick={DeleteTask}
      disabled={loading || fetching || deleting}
      className="inline-flex items-center justify-center gap-2
        rounded-xl border border-red-200
        bg-red-50 px-4 py-2.5
        text-sm font-semibold text-red-600
        hover:bg-red-100 hover:border-red-300
        active:scale-[0.98]
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={16} />

      {deleting ? 'Deleting...' : 'Delete Task'}
    </button>
  )}

  {/* Create / Update Button */}
  <div className="sm:ml-auto">
    <SubmitButton disabled={loading || fetching || deleting}>
      {loading
        ? (isEditMode ? 'Updating...' : 'Creating...')
        : (isEditMode ? 'Update Task' : 'Create Task')}
    </SubmitButton>
  </div>

</div>

      </form>

    </AdminLayout>
  );
}
