export const validateEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address'

export const validatePassword = (v) =>
  v.length >= 8 ? '' : 'Password must be at least 8 characters'

export const validateToken = (v) =>
  /^\d{6}$/.test(v) ? '' : 'Invite token must be 6 digits'

export const validateName = (v) => (v.trim() ? '' : 'Full name is required')
