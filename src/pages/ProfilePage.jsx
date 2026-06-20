import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import styles from './Page.module.css';

function ProfilePage() {
  // `email` holds the display name returned by the API.
  const { email: userName, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        // API returns { tasks: [...] }.
        const data = await response.json();
        const todos = data.tasks || [];

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionRate =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Your Profile</h2>

      <div className={styles.section}>
        <h3>Account</h3>
        <p>Name: {userName}</p>
        <p className={styles.muted}>Status: Logged in</p>
      </div>

      <div className={styles.section}>
        <h3>Todo Statistics</h3>

        {loading && <p className={styles.muted}>Loading statistics…</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{todoStats.total}</div>
                <div className={styles.statLabel}>Total</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{todoStats.completed}</div>
                <div className={styles.statLabel}>Completed</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>{todoStats.active}</div>
                <div className={styles.statLabel}>Active</div>
              </div>
            </div>
            {todoStats.total > 0 && (
              <p className={styles.muted}>
                Completion: {completionRate}%
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
