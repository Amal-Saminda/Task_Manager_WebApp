  import axiosInstance from '../../../shared/api/axiosInstance';

  const authService = {
    // POST /auth/login  { email, password }
    // -> { accessToken, user: { id, fullName, email, role, profileImageUrl } }
    login: async ({ email, password }) => {
      const { data } = await axiosInstance.post('/api/auth/login', { email, password });
      return data;
    },

    // POST /auth/register  (multipart/form-data)
    // fields: fullName, email, password, inviteToken, profileImage (file)
    register: async ({ fullName, email, password, inviteToken, profileImage }) => {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('inviteToken', inviteToken);
      formData.append('profileImage', profileImage);

      const { data } = await axiosInstance.post('/api/auth/register', formData);
      return data;
    },
  };

  export default authService;
