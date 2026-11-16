import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';

const authService = {
  // POST /api/auth/login  { email, password }
  // -> { _id, name, email, role, profileImageUrl, token }
  login: async ({ email, password }) => {
    const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
    return data;
  },

  // Step 1: POST /api/auth/upload-image (multipart, field "image") -> { imageUrl }
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.imageUrl;
  },

  // Step 2: POST /api/auth/register (JSON) with the uploaded image URL.
  // adminInviteToken empty -> normal user, correct token -> admin.
  register: async ({ fullName, email, password, inviteToken, profileImage }) => {
    const profileImageUrl = profileImage ? await authService.uploadImage(profileImage) : null;

    const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      fullName,
      email,
      password,
      profileImageUrl,
      adminInviteToken: inviteToken || '',
    });
    return data;
  },
};

export default authService;
