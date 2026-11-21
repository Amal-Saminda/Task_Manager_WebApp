import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import { LucideFileSpreadsheet } from 'lucide-react';
import TaskStatusTabs from '../components/createTask/TaskStatusTabs';
import TaskCard from '../components/TaskCard';

const ManageTasks = () => {

  const [allTasks , setAllTasks] = useState([]);

  const [tabs , setTabs] = useState([]);
  const [filterStatus , setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks (response.data?.tasks?.length > 0 ? response.data.tasks : []);

      //Map status-summary data with fixed lables & order 
      const statusSummry = response.data?.statusSummry || {};

      const statusArray = [
      {lable: "All" , count: statusSummry.all || 0},
      {lable: "Pending" , count: statusSummry.pendingTask || 0},
      {lable: "In Progress" , count: statusSummry.inProgress || 0},
      {lable: "Completed" , count: statusSummry.Completed || 0},
      ];

      setTabs(statusArray);
    } catch(error) {
    console.log("Error fetching user:" , error);
  }
}
  

  const handleClick = (taskData) => {
    navigate('/admin/create-task', {state: {taskId: taskData._id} })
  };  

  //Download Task Report

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download","task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
  console.error("Download Error:", error);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Response:", error.response.data);

    if (error.response.data instanceof Blob) {
      const errorMessage = await error.response.data.text();
      console.log("Server Error Message:", errorMessage);
    }
  } else {
    console.log("Error Message:", error.message);
  }
}

  
    
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  },[filterStatus]);
  
 
return (
  <AdminLayout activeKey="manage-tasks">
    <div className="my-5">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between">

        <h2 className="text-xl md:text-xl font-medium">
          My Tasks
        </h2>

        {tabs?.length > 0 && (
          <div className="flex items-center gap-3">

            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />

            <button
              className="hidden lg:flex download-btn"
              onClick={handleDownloadReport}
            >
              <LucideFileSpreadsheet className="text-lg" />
              Download Report
            </button>

          </div>
        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

        {allTasks?.map((item) => (
          <TaskCard
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={item.progress}
            createAt={item.createAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo?.map(
              (user) => user.profileImageUrl
            )}
            attachmentCount={item.attachments?.length || 0}
            completedTodoCount={item.completedTodoCount || 0}
            todoChecklist={item.todoChecklist || []}
            onClick={() => handleClick(item)}
          />
        ))}

      </div>

    </div>
  </AdminLayout>
);
}
export default ManageTasks