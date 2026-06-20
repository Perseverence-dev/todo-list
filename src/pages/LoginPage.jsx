import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import styles from './Page.module.css';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to return after login — set by RequireAuth, defaults to /todos.
  const from = location.state?.from?.pathname || '/todos';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsLoggingOn(true);
      setAuthError('');

      const result = await login(email, password);

      if (!result.success) {
        setAuthError(result.error);
      }
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Log On</h2>

      {authError && <p className={styles.error}>{authError}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="logonEmail">Email</label>
          <input
            id="logonEmail"
            type="email"
            value={email}
            required
            maxLength={254}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="logonPassword">Password</label>
          <input
            id="logonPassword"
            type="password"
            value={password}
            required
            maxLength={128}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
