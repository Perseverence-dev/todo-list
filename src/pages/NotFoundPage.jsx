import { Link } from 'react-router';

/**
 * Catch-all 404 page for unmatched routes. Gives the user friendly recovery
 * links instead of a blank screen.
 */
function NotFoundPage() {
  return (
    <main className="notFound">
      <h2>404: Page Not Found</h2>
      <p>Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist.</p>

      {/* Link (not <a>) keeps navigation client-side — no full page reload. */}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/todos">Todos</Link>
        </li>
      </ul>
    </main>
  );
}

export default NotFoundPage;
