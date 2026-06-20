import styles from './Controls.module.css';

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <section className={styles.control}>
      <div className={styles.field}>
        <label htmlFor="filterInput">Search todos:</label>
        <input
          id="filterInput"
          type="text"
          value={filterTerm}
          onChange={(event) => onFilterChange(event.target.value)}
          placeholder="Search by title..."
          maxLength={100}
        />
      </div>
    </section>
  );
}

export default FilterInput;