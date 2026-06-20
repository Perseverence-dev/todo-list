import { useContext } from 'react';
import { AuthContext } from './authContextInstance';

/**
 * Access the authentication context (email/name, token, isAuthenticated,
 * login, logout).
 *
 * Kept in its own module — separate from AuthContext.jsx — so the provider
 * file only exports a component plus the context constant, which Vite's React
 * fast refresh requires.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
