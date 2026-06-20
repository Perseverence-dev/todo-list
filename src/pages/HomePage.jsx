import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

/**
 * Root route ("/"). Acts as an auth-aware entry point: it doesn't render a UI
 * of its own, it just forwards the user to the right place.
 */
function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // `replace: true` swaps the current history entry instead of pushing a new
    // one, so the Back button won't return to "/" and re-trigger this redirect.
    navigate(isAuthenticated ? '/todos' : '/login', { replace: true });
  }, [isAuthenticated, navigate]);

  return <p>Redirecting…</p>;
}

export default HomePage;
