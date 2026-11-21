import { LucideFileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import TaskList from '../../../shared/components/task/TaskList';
import { API_PATHS } from '../../../shared/api/apipaths';
import { downloadReport } from '../../../utils/downloadReport';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { PATHS } from '../../../routes/paths';

const ManageTasks = () => {

  const navigate = useNavigate();

  const handleClick = (taskData) => {
    navigate(PATHS.ADMIN_CREATE_TASK, { state: { taskId: taskData._id } });
  };

  //Download Task Report
  const handleDownloadReport = async () => {
    try {
      await downloadReport(API_PATHS.REPORTS.EXPORT_TASKS, 'task_details.xlsx');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to download report'));
    }
  };

  return (
    <AdminLayout activeKey="manage-tasks">
      <TaskList
        title="Manage Tasks"
        onTaskClick={handleClick}
        action={
          <button className="hidden lg:flex download-btn" onClick={handleDownloadReport}>
            <LucideFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        }
      />
    </AdminLayout>
  );
};

export default ManageTasks;
