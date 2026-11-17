const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_IMAGE_SIZE_MB = 2;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const validateImage = (file) => {
  if (!file) return 'Profile picture is required';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG or WebP image';
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
  return '';
};

const emailError = (email) => {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return '';
};

export const validateLogin = ({ email, password }) => {
  const errors = {};
  const e = emailError(email);
  if (e) errors.email = e;
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateSignUp = ({ fullName, email, password, inviteToken, signupAs, profileImage }) => {
  const errors = {};

  const imageError = validateImage(profileImage);
  if (imageError) errors.profileImage = imageError;

  if (!fullName.trim()) errors.fullName = 'Full name is required';
  else if (fullName.trim().length < 2) errors.fullName = 'Name is too short';

  const e = emailError(email);
  if (e) errors.email = e;

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Use at least 8 characters';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.password = 'Include at least one letter and one number';

  // Token is only needed when registering as Admin; members need none
  if (signupAs === 'admin' && !inviteToken.trim()) errors.inviteToken = 'Enter the admin invite token';

  return errors;
};
