import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import styles from './Page.module.css';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // replace avoids leaving "/" in history and re-triggering the redirect.
    navigate(isAuthenticated ? '/todos' : '/login', { replace: true });
  }, [isAuthenticated, navigate]);

  return <p className={styles.redirect}>Redirecting…</p>;
}

export default HomePage;
