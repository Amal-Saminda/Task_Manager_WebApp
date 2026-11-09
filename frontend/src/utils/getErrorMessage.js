// Turns any axios / unknown error into a readable message for the UI.
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) return message[0]; // NestJS class-validator returns an array
  if (typeof message === 'string' && message) return message;
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection.';

  return fallback;
};
