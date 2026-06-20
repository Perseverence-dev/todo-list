import { useSearchParams } from 'react-router';
import styles from './Controls.module.css';

// Keeps the active status filter in the URL so the view stays bookmarkable.
function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (status) => {
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.control}>
      <div className={styles.field}>
        <label htmlFor="statusFilter">Show:</label>
        <select
          id="statusFilter"
          value={currentStatus}
          onChange={(event) => handleStatusChange(event.target.value)}
        >
          <option value="all">All Todos</option>
          <option value="active">Active Todos</option>
          <option value="completed">Completed Todos</option>
        </select>
      </div>
    </div>
  );
}

export default StatusFilter;
