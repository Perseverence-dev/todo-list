import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';

/**
 * Profile page: shows the signed-in user and live todo statistics fetched
 * from the API (total / completed / active and a completion percentage).
 */
function ProfilePage() {
  // In this app's AuthContext the `email` field actually holds the user's
  // display name (set from the API's `data.name`), so alias it for clarity.
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

        // Relative path so Vite's dev proxy forwards the request to the API.
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

        // This API wraps the list in { tasks: [...] }, not a bare array.
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

  // Guard against divide-by-zero before computing a percentage.
  const completionRate =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <main className="profile">
      <h2>Your Profile</h2>

      <section>
        <h3>Account</h3>
        <p>Name: {userName}</p>
        <p>Status: Logged in</p>
      </section>

      <section>
        <h3>Todo Statistics</h3>

        {loading && <p>Loading statistics…</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <p>Total: {todoStats.total}</p>
            <p>Completed: {todoStats.completed}</p>
            <p>Active: {todoStats.active}</p>
            {todoStats.total > 0 && <p>Completion: {completionRate}%</p>}
          </>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
