import { addThousandSeparater } from '../../../utils/helper';
import StatCard from './StatCard';
import TaskDistributionChart from './TaskDistributionChart';
import PriorityChart from './PriorityChart';
import RecentTasks from './RecentTasks';

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

// Used by both the admin dashboard and the user dashboard.
// dashboardData = response of /api/tasks/dashboard-data or /api/tasks/user-dashboard-data
export default function DashboardContent({ userName, dashboardData, onSeeAll, onTaskClick }) {

  const distribution = dashboardData?.charts?.taskDistribution || {};
  const priorityLevel = dashboardData?.charts?.taskpriorityLevel || {};
  const overDueTasks = dashboardData?.statistics?.overDueTasks || 0;

  const priorityData = [
    { label: 'Low', value: priorityLevel.Low || 0 },
    { label: 'Medium', value: priorityLevel.Medium || 0 },
    { label: 'High', value: priorityLevel.High || 0 },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome + summary cards */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          {getGreeting()}! {userName}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{formatToday()}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Tasks" value={addThousandSeparater(distribution.All || 0)} accent="blue" />
          <StatCard label="Pending Tasks" value={addThousandSeparater(distribution.Pending || 0)} accent="violet" />
          <StatCard label="In Progress" value={addThousandSeparater(distribution.InProgress || 0)} accent="cyan" />
          <StatCard label="Completed Tasks" value={addThousandSeparater(distribution.Completed || 0)} accent="green" />
          <StatCard label="Overdue" value={addThousandSeparater(overDueTasks)} accent="red" />
        </div>
      </section>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Task Distribution">
          <TaskDistributionChart
            pending={distribution.Pending || 0}
            inProgress={distribution.InProgress || 0}
            completed={distribution.Completed || 0}
          />
        </Card>

        <Card title="Task Priority Levels">
          <PriorityChart data={priorityData} />
        </Card>
      </div>

      <RecentTasks
        tasks={dashboardData?.recentTasks || []}
        onSeeAll={onSeeAll}
        onTaskClick={onTaskClick}
      />
    </div>
  );
}
