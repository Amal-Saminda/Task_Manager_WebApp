import { createContext, useCallback, useMemo, useState } from 'react';
import authService from '../modules/auth/services/authService';
import {TOKEN_KEY}  from '../shared/api/axiosInstance';

export const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(TOKEN_KEY));
    return stored?.token && stored?.user ? stored : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const saveSession = useCallback((data) => {
    const next = { token: data.accessToken, user: data.user };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(next));
    setSession(next);
    return next.user;
  }, []);

  const login = useCallback(
    async (credentials) => saveSession(await authService.login(credentials)),
    [saveSession]
  );

  // Returns the API response. Auto-signs-in only if the API returns a token.
  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      if (data?.accessToken && data?.user) saveSession(data);
      return data;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setSession({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token),
      login,
      register,
      logout,
    }),
    [session, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
