import { Link } from 'react-router';
import styles from './Page.module.css';

function NotFoundPage() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>404: Page Not Found</h2>
      <p className={styles.muted}>
        Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>

      <ul className={styles.links}>
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
    </section>
  );
}

export default NotFoundPage;
