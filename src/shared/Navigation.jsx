import { NavLink } from 'react-router';
import { useAuth } from '../contexts/useAuth';

// NavLink automatically calls this style callback with an { isActive } flag
// for the link whose `to` matches the current URL, letting us highlight the
// active route without manually tracking the current page.
const navLinkStyle = ({ isActive }) => ({
  fontWeight: isActive ? 'bold' : 'normal',
  textDecoration: isActive ? 'underline' : 'none',
});

/**
 * Primary navigation. Shows different links depending on auth status and
 * highlights the active route automatically via NavLink.
 */
function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          gap: '1rem',
          padding: 0,
        }}
      >
        {/* Always available */}
        <li>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" style={navLinkStyle}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" style={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
