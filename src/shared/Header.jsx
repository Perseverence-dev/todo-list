/**
 * Shared application header.
 * It shows the app title and basic authentication status.
 */
function Header({ email, token, onSetEmail, onSetToken }) {
  function handleLogOut() {
    // Clear authentication state in App.
    onSetEmail('');
    onSetToken('');
  }

  return (
    <header>
      <h1>Todo List</h1>

      {token && (
        <div>
          <span>Signed in as {email}</span>
          <button type="button" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;