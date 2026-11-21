import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle2, Paperclip } from 'lucide-react';
import moment from 'moment';
import toast from 'react-hot-toast';

import UserLayout from '../components/UserLayout';
import Avatar from '../../../shared/components/Avatar';
import Progress from '../../../shared/components/task/Progress';
import { PRIORITY_STYLES, STATUS_STYLES } from '../../../shared/components/task/taskStyles';

import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { PATHS } from '../../../routes/paths';

const isLink = (text) => /^https?:\/\//i.test(text);

const TaskDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Get task details by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASKS_BY_ID(id));
      setTask(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load task'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTaskDetailsByID();
  }, [id]);

  // Tick / untick one checklist item
  const handleToggleTodo = async (index) => {
    const updatedList = task.todoCheckList.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    setSaving(true);

    try {
      // backend recalculates progress + status from the checklist
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoCheckList: updatedList }
      );

      setTask(response.data.task);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update checklist'));
    } finally {
      setSaving(false);
    }
  };

  // Mark whole task as completed
  const handleMarkCompleted = async () => {
    setSaving(true);

    try {
      await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK_STATUS(id),
        { status: 'Completed' }
      );

      await getTaskDetailsByID();
      toast.success('Task marked as completed');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update status'));
    } finally {
      setSaving(false);
    }
  };

  const isOverdue = task && task.status !== 'Completed' && moment(task.dueDate).isBefore(moment(), 'day');

  return (
    <UserLayout activeKey="my-tasks">

      <button
        type="button"
        onClick={() => navigate(PATHS.USER_MY_TASKS)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tasks
      </button>

      {loading && <p className="text-sm text-gray-500">Loading task details...</p>}

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      {task && (
        <div className="max-w-4xl space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

          {/* Title + badges */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded px-4 py-0.5 text-[11px] font-medium ${STATUS_STYLES[task.status]}`}>
                {task.status}
              </span>
              <span className={`rounded px-4 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[task.priority]}`}>
                {task.priority} priority
              </span>
              {isOverdue && (
                <span className="rounded bg-rose-50 px-4 py-0.5 text-[11px] font-medium text-rose-600">
                  Overdue
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-semibold text-slate-900">{task.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-500">{task.description}</p>
          </div>

          {/* Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <Progress progress={task.progress} status={task.status} />
          </div>

          {/* Dates + members */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Start Date</span>
              <p className="mt-1 text-sm font-semibold text-gray-700">
                {moment(task.createdAt).format('Do MMM YYYY')}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Due Date</span>
              <p className={`mt-1 text-sm font-semibold ${isOverdue ? 'text-rose-600' : 'text-gray-700'}`}>
                {moment(task.dueDate).format('Do MMM YYYY')}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Assigned To</span>
              <div className="mt-1 flex items-center">
                {task.assignedTo?.map((user) => (
                  <Avatar
                    key={user._id}
                    name={user.name}
                    src={user.profileImageUrl}
                    size="sm"
                    className="-ml-2 ring-2 ring-white first:ml-0"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">TODO Checklist</h3>

            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {task.todoCheckList?.map((item, index) => (
                <li key={item._id || index}>
                  <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      disabled={saving}
                      onChange={() => handleToggleTodo(index)}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        item.completed
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {item.completed && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Attachments */}
          {task.attachments?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Attachments</h3>

              <ul className="space-y-2">
                {task.attachments.map((link, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 rounded-xl border border-slate-100 px-4 py-2.5 text-sm"
                  >
                    <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                    {isLink(link) ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                    ) : (
                      <span className="truncate text-slate-600">{link}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mark completed */}
          {task.status !== 'Completed' && (
            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleMarkCompleted}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Completed
              </button>
            </div>
          )}

        </div>
      )}

    </UserLayout>
  );
};

export default TaskDetails;
