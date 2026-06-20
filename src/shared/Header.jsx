import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import Navigation from './Navigation';
import styles from './Header.module.css';

function Header() {
  const { email, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.brand}>Todo List</h1>

        <Navigation />

        {isAuthenticated && (
          <div className={styles.user}>
            <span className={styles.userName}>Signed in as {email}</span>
            <button
              type="button"
              className={styles.logout}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;