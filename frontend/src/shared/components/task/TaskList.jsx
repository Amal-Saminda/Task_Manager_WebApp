import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { API_PATHS } from '../../api/apipaths';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import TaskStatusTabs from './TaskStatusTabs';
import TaskCard from './TaskCard';

// Task cards with status tabs. Used by admin "Manage Tasks" and user "My Tasks".
// The API only returns the tasks the logged-in user is allowed to see.
export default function TaskList({ title, onTaskClick, action }) {

  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAllTasks = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === 'All' ? '' : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks || []);

      //Map status-summary data with fixed labels & order
      const statusSummary = response.data?.statusSummary || {};

      setTabs([
        { label: 'All', count: statusSummary.all || 0 },
        { label: 'Pending', count: statusSummary.pendingTasks || 0 },
        { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
        { label: 'Completed', count: statusSummary.completedTasks || 0 },
      ]);

      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <div className="my-5">

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center justify-between">

        <h2 className="text-xl font-medium">{title}</h2>

        {tabs.length > 0 && (
          <div className="flex items-center gap-3">
            <TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
            {action}
          </div>
        )}

      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && allTasks.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">No tasks found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {allTasks.map((item) => (
          <TaskCard
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={item.progress}
            createdAt={item.createdAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo || []}
            attachmentCount={item.attachments?.length || 0}
            completedTodoCount={item.completedTodoCount || 0}
            todoCheckList={item.todoCheckList || []}
            onClick={() => onTaskClick(item)}
          />
        ))}
      </div>

    </div>
  );
}
