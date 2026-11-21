import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import DashboardContent from '../../../shared/components/task/DashboardContent';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import useAuth from '../../../hooks/useAuth';
import { PATHS, getUserTaskPath } from '../../../routes/paths';

export default function UserDashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);

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
    <UserLayout activeKey="dashboard">
      <DashboardContent
        userName={user?.name}
        dashboardData={dashboardData}
        onSeeAll={() => navigate(PATHS.USER_MY_TASKS)}
        onTaskClick={(task) => navigate(getUserTaskPath(task._id))}
      />
    </UserLayout>
  );
}
