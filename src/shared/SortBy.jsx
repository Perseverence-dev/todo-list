import styles from './Controls.module.css';

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <section className={styles.control}>
      <div className={styles.field}>
        <label htmlFor="sortBy">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="sortDirection">Order:</label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </section>
  );
}

export default SortBy;