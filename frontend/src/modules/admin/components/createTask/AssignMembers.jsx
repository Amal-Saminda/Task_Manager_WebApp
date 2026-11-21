
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import Avatar from '../../../../shared/components/Avatar';
import SelectUserModal from './SelectUserModal';
import { addButtonClass } from './formStyles';
import axiosInstance from '../../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../../shared/api/apipaths';

const MAX_VISIBLE = 3;

export default function AssignMembers({
  selectedIds,
  onChange,
  hasError
}) {

  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.USERS.GET_ALL_USERS
      );

      setAllUsers(
        Array.isArray(response.data)
          ? response.data
          : response.data.users || []
      );

    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const selectedUsers = allUsers.filter((user) =>
    selectedIds.includes(user._id)
  );

  const extra = selectedUsers.length - MAX_VISIBLE;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Assign members"
        className={`${addButtonClass} w-full sm:w-auto ${
          hasError ? 'ring-2 ring-red-300' : ''
        }`}
      >
        {selectedUsers.length === 0 ? (
          <>
            <Users className="h-4 w-4" />
            Add Members
          </>
        ) : (
          <span className="flex items-center">
            {selectedUsers.slice(0, MAX_VISIBLE).map((user) => (
              <Avatar
                key={user._id}
                name={user.name}
                src={user.profileImageUrl}
                size="sm"
                className="-ml-2 ring-2 ring-white first:ml-0"
              />
            ))}

            {extra > 0 && (
              <span className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 ring-2 ring-white">
                +{extra}
              </span>
            )}
          </span>
        )}
      </button>

      {open && (
        <SelectUserModal
          members={allUsers}
          selectedIds={selectedIds}
          onClose={() => setOpen(false)}
          onSave={(ids) => {
            onChange(ids);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
