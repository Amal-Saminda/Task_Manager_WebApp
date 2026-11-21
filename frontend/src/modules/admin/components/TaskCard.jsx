import React from 'react'
import progress from './Progress';
import { LucidePaperclip } from 'lucide-react';
import moment from "moment";
import SelectUserModal from './createTask/SelectUserModal';
import Avatar from './Avatar';

const TaskCard = ({description,priority,status,progress,createAt,dueDate,assignedTo,todoChecklist,completedTodoCount,onClick,title}) => {

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

        case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

        default:
          return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const  getPriorityColortab = () => {
    switch (priority) {
      case "Low" :
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
    

    case "Medium":
      return "text-amber-500 bg-amber-50 border border-amber-500/10";

    default:
      return "text-rose-500 bg-rose-50 border border-rose-500/10";
  }
};

  return <div
  className="bg-white rounded-2xl p-4
  border border-gray-100
  shadow-sm shadow-gray-200/50
  hover:shadow-md hover:shadow-gray-200/60
  hover:border-gray-200
  transition-all duration-200 ease-in-out
  cursor-pointer"
  onClick={onClick}
  >
    <div className='flex items-end gap-3 px-4'>
      <div
      className={`text-[11px] font-medium ${getPriorityColortab()} px-4 py-0.5 rounded`}
      >
        {status}
      </div>
      <div
      className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`} >
        {priority} priority
      </div>
    </div>
      <div 
      className={`px-4 border-l-[3px] ${
        status=== "In Progress" ? "border-cyan-500" : status === "Completed" ? "border-indigo-500" : 
        "border-violet-500"
      }`} >
        <p className="text-sm md:text-base font-semibold text-gray-800 leading-snug tracking-tight">
          {title}
        </p>

        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mt-1 line-clamp-2">
          {description}
        </p>

 <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
  Task Done:
  <span className="text-lime-600 font-semibold">
    {completedTodoCount} / {todoChecklist.length || 0}
  </span>
</p>
        <progress progress={progress} status={status} />
      </div>
        <div className="flex items-center gap-3 mt-4">

  {/* Start Date */}
  <div className="flex-1 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
      Start Date
    </span>
    <p className="text-xs font-semibold text-gray-700 mt-1">
      {moment(createAt).format("Do MMM YYYY")}
    </p>
  </div>

  {/* Due Date */}
  <div className="flex-1 rounded-lg bg-lime-50/70 border border-lime-100 px-3 py-2">
    <span className="text-[11px] font-medium text-lime-600 uppercase tracking-wide">
      Due Date
    </span>
    <p className="text-xs font-semibold text-lime-700 mt-1">
      {moment(dueDate).format("Do MMM YYYY")}
    </p>
  </div>

</div>

  </div>
  
}

export default TaskCard