import { useAuth } from '../contexts/AuthContext';

/**
 * Shared application header.
 * Week 9: Header reads authentication state directly from AuthContext,
 * instead of receiving token/email/logout props from App.
 */
function Header() {
  const { email, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {isAuthenticated && (
        <div>
          <span>Signed in as {email}</span>{' '}
          <button type="button" onClick={logout}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;