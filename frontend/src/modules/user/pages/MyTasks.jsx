import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import TaskList from '../../../shared/components/task/TaskList';
import { getUserTaskPath } from '../../../routes/paths';

const MyTasks = () => {

  const navigate = useNavigate();

  return (
    <UserLayout activeKey="my-tasks">
      <TaskList
        title="My Tasks"
        onTaskClick={(task) => navigate(getUserTaskPath(task._id))}
      />
    </UserLayout>
  );
};

export default MyTasks;
