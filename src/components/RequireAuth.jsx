import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

/**
 * Wrapper that protects routes requiring authentication.
 *
 * Centralizing the auth check here (instead of repeating it inside every
 * protected page) means a single place to audit, no duplicated logic, and
 * consistent redirect behavior across the app.
 */
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Remember where the user was heading so LoginPage can send them back
      // after a successful login.
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // Don't flash protected content while the redirect effect runs.
  if (!isAuthenticated) {
    return <p>Redirecting to login…</p>;
  }

  return children;
}

export default RequireAuth;
