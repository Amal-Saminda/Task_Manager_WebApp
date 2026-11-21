import { LucidePaperclip } from 'lucide-react';
import moment from 'moment';
import Avatar from '../Avatar';
import Progress from './Progress';
import { PRIORITY_STYLES, STATUS_STYLES } from './taskStyles';

const MAX_VISIBLE = 3;

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo = [],
  todoCheckList = [],
  completedTodoCount = 0,
  attachmentCount = 0,
  onClick,
}) => {

  const isOverdue = status !== 'Completed' && moment(dueDate).isBefore(moment(), 'day');

  const getBorderColor = () => {
    switch (status) {
      case 'In Progress':
        return 'border-cyan-500';
      case 'Completed':
        return 'border-indigo-500';
      default:
        return 'border-violet-500';
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-4
      border border-gray-100
      shadow-sm shadow-gray-200/50
      hover:shadow-md hover:shadow-gray-200/60
      hover:border-gray-200
      transition-all duration-200 ease-in-out
      cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div className={`text-[11px] font-medium ${STATUS_STYLES[status] || STATUS_STYLES.Pending} px-4 py-0.5 rounded`}>
          {status}
        </div>
        <div className={`text-[11px] font-medium ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low} px-4 py-0.5 rounded`}>
          {priority} priority
        </div>
      </div>

      <div className={`mt-3 px-4 border-l-[3px] ${getBorderColor()}`}>
        <p className="text-sm md:text-base font-semibold text-gray-800 leading-snug tracking-tight">
          {title}
        </p>

        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mt-1 line-clamp-2">
          {description}
        </p>

        <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-2 mb-2">
          Task Done:
          <span className="text-lime-600 font-semibold">
            {completedTodoCount} / {todoCheckList.length}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="flex items-center gap-3 mt-4">
        {/* Start Date */}
        <div className="flex-1 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
            Start Date
          </span>
          <p className="text-xs font-semibold text-gray-700 mt-1">
            {moment(createdAt).format('Do MMM YYYY')}
          </p>
        </div>

        {/* Due Date */}
        <div
          className={`flex-1 rounded-lg border px-3 py-2 ${
            isOverdue ? 'bg-rose-50/70 border-rose-100' : 'bg-lime-50/70 border-lime-100'
          }`}
        >
          <span
            className={`text-[11px] font-medium uppercase tracking-wide ${
              isOverdue ? 'text-rose-500' : 'text-lime-600'
            }`}
          >
            {isOverdue ? 'Overdue' : 'Due Date'}
          </span>
          <p className={`text-xs font-semibold mt-1 ${isOverdue ? 'text-rose-600' : 'text-lime-700'}`}>
            {moment(dueDate).format('Do MMM YYYY')}
          </p>
        </div>
      </div>

      {/* Members + attachments */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center">
          {assignedTo.slice(0, MAX_VISIBLE).map((user) => (
            <Avatar
              key={user._id}
              name={user.name}
              src={user.profileImageUrl}
              size="sm"
              className="-ml-2 ring-2 ring-white first:ml-0"
            />
          ))}

          {assignedTo.length > MAX_VISIBLE && (
            <span className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 ring-2 ring-white">
              +{assignedTo.length - MAX_VISIBLE}
            </span>
          )}
        </div>

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <LucidePaperclip className="h-4 w-4" />
            {attachmentCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
