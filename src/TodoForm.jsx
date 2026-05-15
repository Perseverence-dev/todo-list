//Week-4 version of TodoForm.jsx, with console.log statements to show the event object and how we read the input value.
import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  // useRef lets us keep a reference to the input element.
  // We use it so we can put the cursor back into the input after submit.
  const inputRef = useRef();

  function handleAddTodo (event) {
    // Prevent the form from refreshing the whole page.
    event.preventDefault();

    // Get the input value using the input name: todoTitle
    // trim() removes extra spaces from the start and end.
    const todoTitle = event.target.todoTitle.value.trim();

    if (todoTitle && todoTitle !== '') {
       // Send the todo text up to App through the prop function.
      onAddTodo(todoTitle);
      // Clear the form after adding the todo.
      event.target.reset();
      // Put the cursor back into the input box for better user experience.
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder="Todo text"
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;