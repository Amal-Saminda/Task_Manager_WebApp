import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import TaskDistributionChart from '../components/TaskDistributionChart';
import PriorityChart from '../components/PriorityChart';
import RecentTasks from '../components/RecentTasks';
import { adminProfile, priorityCounts, summary, tasks } from '../data/dashboardData';

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
  return (
    <AdminLayout activeKey="dashboard">
      <div className="space-y-6">
        {/* Welcome + summary cards */}
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            {getGreeting()}! {adminProfile.name}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{formatToday()}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Tasks" value={summary.total} accent="blue" />
            <StatCard label="Pending Tasks" value={summary.pending} accent="violet" />
            <StatCard label="In Progress" value={summary.inProgress} accent="cyan" />
            <StatCard label="Completed Tasks" value={summary.completed} accent="green" />
          </div>
        </section>

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

        <RecentTasks tasks={tasks} />
      </div>
    </AdminLayout>
  );
}
