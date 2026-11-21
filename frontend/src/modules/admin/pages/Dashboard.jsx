import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import DashboardContent from '../../../shared/components/task/DashboardContent';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import useAuth from '../../../hooks/useAuth';
import { PATHS } from '../../../routes/paths';

export default function Dashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <AdminLayout activeKey="dashboard">
      <DashboardContent
        userName={user?.name}
        dashboardData={dashboardData}
        onSeeAll={() => navigate(PATHS.ADMIN_MANAGE_TASK)}
        onTaskClick={(task) => navigate(PATHS.ADMIN_CREATE_TASK, { state: { taskId: task._id } })}
      />
    </AdminLayout>
  );
}
