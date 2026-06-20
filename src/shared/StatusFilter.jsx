import { useSearchParams } from 'react-router';

/**
 * Stores the todo status filter in the URL (e.g. /todos?status=completed).
 * Keeping filter state in the URL makes the filtered view bookmarkable,
 * shareable, and compatible with the browser's back/forward buttons.
 */
function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const handleStatusChange = (status) => {
    if (status === 'all') {
      // Drop the param entirely for the default so the URL stays clean.
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  return (
    <div>
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
  );
}

export default StatusFilter;
