import { useEffect,useContext, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import AdminLayout from '../components/AdminLayout'
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import StatCard from '../components/StatCard';
import TaskDistributionChart from '../components/TaskDistributionChart';
import PriorityChart from '../components/PriorityChart';
import RecentTasks from '../components/RecentTasks';
import { adminProfile, tasks ,summary , priorityCounts } from '../data/dashboardData';
import { addThousandSeparater } from '../../../utils/helper';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const formatToday = () =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const Card = ({ title, children }) => (
  <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
    <h2 className="mb-5 text-lg font-semibold text-slate-900">{title}</h2>
    {children}
  </section>
);

export default function Dashboard() {

  useAuth();

  const user = useContext(AuthContext);

  const [dashboardData , setDashboardData] = useState(null);

  const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.TASKS.GET_DASHBOARD_DATA,
      
    );

    if(response.data) {
      setDashboardData(response.data);
      
    }
  } catch (error) {
    console.error("Error fetching users", error)    
  }

  };

useEffect (() => {
  getDashboardData();

  return () => {};
}, []);

  return (

        <AdminLayout activeKey="dashboard">

          <div className="space-y-6">

            {/* Welcome + summary cards */}
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {getGreeting()}! {user.name}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{formatToday()}</p> 

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <StatCard label="Total Tasks" value={addThousandSeparater(
                            dashboardData?.charts?.taskDistribution?.All || 0
                          )} accent="blue" />
                          <StatCard label="Pending Tasks" value={addThousandSeparater(
                            dashboardData?.charts?.taskDistribution?.pending || 0
                          )} accent="violet" />
                          <StatCard label="In Progress" value={addThousandSeparater(
                            dashboardData?.charts?.taskDistribution?.InProgress || 0
                          )} accent="cyan" />
                          <StatCard label="Completed Tasks" value={addThousandSeparater(
                            dashboardData?.charts?.taskDistribution?.Completed || 0
                          )} accent="green" />

                          
                </div>
            </section>
          <div>
            </div>
                        {/* Charts */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card title="Task Distribution">
                      <TaskDistributionChart
                        pending={summary.pending}
                        inProgress={summary.inProgress}
                        completed={summary.completed}
                      />
                    </Card>
          
                    <Card title="Task Priority Levels">
                      <PriorityChart data={priorityCounts} />
                    </Card>
                  </div>
            
              <RecentTasks tasks= {tasks}/>
            </div>
             
              </AdminLayout>
  );
}
