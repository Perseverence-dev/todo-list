import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Logon uses a pessimistic UI update.
 * Week 9: login comes from AuthContext, so this component no longer needs
 * authentication setter props from App.
 */
function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

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
    <section>
      <h2>Log On</h2>

      {authError && <p>{authError}</p>}

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

export default Logon;