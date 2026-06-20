import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContextInstance';

// Week 9: AuthContext eliminates authentication prop drilling.
// The context instance lives in ./authContextInstance and the consuming hook in
// ./useAuth, so this file exports only the provider component — which keeps it
// compatible with Vite's React fast refresh.

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(
    () => sessionStorage.getItem('todoAppEmail') || ''
  );
  const [token, setToken] = useState(
    () => sessionStorage.getItem('todoAppToken') || ''
  );

  const login = useCallback(async (userEmail, password) => {
    try {
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);

        sessionStorage.setItem('todoAppEmail', data.name);
        sessionStorage.setItem('todoAppToken', data.csrfToken);

        return { success: true };
      }

      return {
        success: false,
        error: data?.message || 'Authentication failed. Please try again.',
      };
    } catch (error) {
      return {
        success: false,
        error: `Network error during login: ${error.message}`,
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('/api/users/logoff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });
      }
    } finally {
      setEmail('');
      setToken('');
      sessionStorage.removeItem('todoAppEmail');
      sessionStorage.removeItem('todoAppToken');
    }
  }, [token]);

  const value = useMemo(
    () => ({
      email,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [email, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}