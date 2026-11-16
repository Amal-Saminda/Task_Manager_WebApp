import { useEffect, useState } from 'react';
import {  Users } from 'lucide-react';
import Avatar from '../Avatar';
import SelectUserModal from './SelectUserModal';
import { addButtonClass } from './formStyles';
import axiosInstance from '../../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../../shared/api/apipaths';

const MAX_VISIBLE = 3;

// "Add Members" button -> opens the picker. Shows stacked avatars once members are chosen.
export default function AssignMembers({ members, selectedIds, onChange, hasError }) {
  const [open, setOpen] = useState(false);
  const [allUsers , setAllUsers] = useState([]);
  const [tempSelectedUsers , setTempSelectedUsers] = useState([]);

  const selected = members.filter((m) => selectedIds.includes(m.id));
  const extra = selected.length - MAX_VISIBLE;

  const getAllusers = async () => {
    try {
        
      const response  =await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if(response.data?.length>0) {
        setAllUsers(response.data);
      }
      
    } catch (error) {
      console.log("Error fetching users", error);
      
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) => 
    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev , userId]
  );
  };

  const handleAssign = () => {
    selectedIds(tempSelectedUsers);
    setOpen(false);
  };

  // const selectedUserAvatars = allUsers
  // .filter((user) => selectedIds.includes(user._id))
  // .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllusers
  }, []);

  useEffect(() => {
    if(selectedIds.length === 0) {
      setTempSelectedUsers ([]);
    }

    return () => {};

  }, [selectedIds]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Assign members"
        className={`${addButtonClass} w-full sm:w-auto ${hasError ? 'ring-2 ring-red-300' : ''}`}
      >
        {selected.length === 0 ? (
          <>
            <Users className="h-4 w-4" />
            Add Members
          </>
        ) : (
          <span className="flex items-center">
            {selected.slice(0, MAX_VISIBLE).map((m) => (
              <Avatar key={m.id} name={m.name} src={m.avatar} size="sm" className="-ml-2 ring-2 ring-white first:ml-0" />
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
          members={members}
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
