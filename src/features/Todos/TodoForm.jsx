import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import {
  isValidTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../utils/todoValidation';
import { sanitizeText } from '../../utils/sanitize';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();

    const trimmedTitle = workingTodoTitle.trim();

    if (!isValidTodoTitle(trimmedTitle)) {
      return;
    }

    // Strip any markup before the title leaves the form.
    onAddTodo(sanitizeText(trimmedTitle));

    setWorkingTodoTitle('');
  }

  return (
    <form className={styles.form} onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        placeholder="Todo text"
        maxLength={MAX_TODO_TITLE_LENGTH}
      />

      <button
        type="submit"
        className={styles.add}
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;