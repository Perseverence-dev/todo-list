import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

/**
 * LoginPage replaces the old Logon feature component.
 * It keeps the original pessimistic-UI login form and adds React Router
 * redirect handling: after a successful login the user is sent to the page
 * they originally tried to reach (preserved by RequireAuth), or /todos.
 */
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // RequireAuth stashes the blocked destination in location.state.from.
  // Fall back to /todos for a normal (non-redirected) login.
  const from = location.state?.from?.pathname || '/todos';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Redirect whenever the user is authenticated. This covers both "already
  // logged in and visited /login" and "just logged in", keeping the navigation
  // logic in a single place.
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
      // On success, the useEffect above performs the redirect.
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <section>
      <h2>Log On</h2>

      {authError && <p role="alert">{authError}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="logonEmail">Email</label>
          <input
            id="logonEmail"
            type="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="logonPassword">Password</label>
          <input
            id="logonPassword"
            type="password"
            value={password}
            required
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
