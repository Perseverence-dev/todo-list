import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import {
  isValidTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../../utils/todoValidation';
import { sanitizeText } from '../../../utils/sanitize';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function startEditing() {
    setWorkingTitle(todo.title);
    setIsEditing(true);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(event) {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    const trimmedTitle = workingTitle.trim();

    if (!isValidTodoTitle(trimmedTitle)) {
      return;
    }

    // Strip any markup before the edited title is saved.
    onUpdateTodo({
      ...todo,
      title: sanitizeText(trimmedTitle),
    });

    setIsEditing(false);
  }

  return (
    <li className={styles.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <div className={styles.edit}>
            <TextInputWithLabel
              elementId={`todo-title-${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={handleEdit}
              placeholder="Todo text"
              maxLength={MAX_TODO_TITLE_LENGTH}
            />

            <button
              type="button"
              className={styles.cancel}
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
              Update
            </button>
          </div>
        ) : (
          <div className={styles.view}>
            <label
              className={styles.checkboxLabel}
              htmlFor={`checkbox-${todo.id}`}
            >
              <input
                className={styles.checkbox}
                type="checkbox"
                id={`checkbox-${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
              <span className="visually-hidden">
                Mark &quot;{todo.title}&quot;{' '}
                {todo.isCompleted ? 'incomplete' : 'complete'}
              </span>
            </label>

            <span
              className={`${styles.title} ${
                todo.isCompleted ? styles.completed : ''
              }`}
              onClick={startEditing}
              title="Click to edit todo"
            >
              {todo.title}
            </span>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;