import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import Navigation from './Navigation';

/**
 * Shared application header.
 * Week 9: Header reads authentication state directly from AuthContext.
 * Week 10: hosts the primary <Navigation /> and redirects to /login on logout.
 */
function Header() {
  const { email, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // logout() clears the session; we then send the user to the login page.
  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header>
      <h1>Todo List</h1>

      <Navigation />

      {isAuthenticated && (
        <div>
          <span>Signed in as {email}</span>{' '}
          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;