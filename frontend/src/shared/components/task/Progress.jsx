import { PROGRESS_COLORS } from './taskStyles';

const Progress = ({ progress = 0, status }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className={`${PROGRESS_COLORS[status] || PROGRESS_COLORS.Pending} h-1.5 rounded-full transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default Progress;
