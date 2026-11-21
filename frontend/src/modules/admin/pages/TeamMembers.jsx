import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import { LucideFileSpreadsheet } from 'lucide-react';
import UserCard from '../components/UserCard';

const TeamMembers = () => {

  const [allUsers , setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {

      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if(response.data?.length > 0) {
        setAllUsers(response.data);

        console.log("Users:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();

    return () => {};
  },[]);

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download","user_details.xlsx");
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

  }
  return (
    <AdminLayout activeKey="team-members">
      <div className='mt-5 mb-10'>
        <div className='flex md:flex-row md:items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>Team Member</h2>
            <button className='flex md:flex download-btn' onClick={handleDownloadReport}>
               <LucideFileSpreadsheet className="text-lg" />
              Download Report
            </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allUsers.map((user) => (
            <UserCard key={user._id} userInfo={user} />

          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default TeamMembers