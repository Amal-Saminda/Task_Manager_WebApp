import { useEffect, useState } from 'react';
import { LucideFileSpreadsheet, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import UserCard from '../components/UserCard';
import AddMemberModal from '../components/AddMemberModal';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import { downloadReport } from '../../../utils/downloadReport';
import { getErrorMessage } from '../../../utils/getErrorMessage';

const TeamMembers = () => {

  const [allUsers, setAllUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setAllUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDownloadReport = async () => {
    try {
      await downloadReport(API_PATHS.REPORTS.EXPORT_USERS, 'user_details.xlsx');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to download report'));
    }
  };

  return (
    <AdminLayout activeKey="team-members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-95 md:px-4 md:text-[13px]"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus className="h-4 w-4" />
              + Team Member
            </button>

            <button className="flex md:flex download-btn" onClick={handleDownloadReport}>
              <LucideFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>

      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onCreated={(newUser) => {
            setAllUsers((prev) => [...prev, newUser]);
            setShowAddModal(false);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default TeamMembers;
