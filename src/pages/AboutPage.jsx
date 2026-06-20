import styles from './Page.module.css';

function AboutPage() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>About This App</h2>
      <p className={styles.muted}>
        A todo manager built for the Code the Dream React course to practice
        modern React patterns and client-side routing.
      </p>

      <div className={styles.section}>
        <h3>Features</h3>
        <ul className={styles.list}>
          <li>Create, complete, and edit todos with a pessimistic UI(wait-for-server updates)</li>
          <li>Sort, text-filter, and status-filter todos</li>
          <li>Shareable, bookmarkable status filters stored in the URL</li>
          <li>Authentication-protected pages with redirect preservation</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Built With</h3>
        <ul className={styles.list}>
          <li>React</li>
          <li>React Router v7</li>
          <li>Vite</li>
        </ul>
      </div>
    </section>
  );
}

export default AboutPage;
