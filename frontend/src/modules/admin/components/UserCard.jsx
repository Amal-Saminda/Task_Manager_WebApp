import Avatar from "../../../shared/components/Avatar";

const UserCard = ({ userInfo }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <Avatar
          name={userInfo?.name}
          src={userInfo?.profileImageUrl}
          size="lg"
          className="shrink-0"
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {userInfo?.name}
          </p>

          <p className="text-xs text-gray-500 truncate mt-1">
            {userInfo?.email}
          </p>

          <span className="inline-flex items-center mt-2 px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-medium border border-gray-100">
            Team Member
          </span>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-3 gap-2 mt-5">

        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />

        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />

        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />

      </div>
    </div>
  );
};

export default UserCard;


const StatCard = ({ label, count, status }) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-sky-50 text-sky-700 border-sky-100";

      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border py-3 px-2 ${getStatusTagColor()}`}
    >
      <span className="text-lg font-semibold leading-none">
        {count}
      </span>

      <span className="text-[10px] font-medium mt-2 text-center whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};