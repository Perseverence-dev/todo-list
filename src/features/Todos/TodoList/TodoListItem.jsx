import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../../utils/todoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  // Tracks whether this item is currently being edited.
  const [isEditing, setIsEditing] = useState(false);

  // Local edit state prevents changes from saving until Update is clicked.
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

    onUpdateTodo({
      ...todo,
      title: trimmedTitle,
    });

    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todo-title-${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={handleEdit}
              placeholder="Todo text"
            />

            <button type="button" onClick={handleCancel}>
              Cancel
            </button>

            <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
              Update
            </button>
          </>
        ) : (
          <>
            <label htmlFor={`checkbox-${todo.id}`}>
              <input
                type="checkbox"
                id={`checkbox-${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>

            <span
              onClick={startEditing}
              style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
              title="Click to edit todo"
            >
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;