import './App.css';
import { useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  // Stores all todos for the application.
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const trimmedTitle = todoTitle.trim();

    // Prevent empty or whitespace-only todos from being added.
    if (!trimmedTitle) {
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: trimmedTitle,
      isCompleted: false,
    };

    // Add the newest todo to the top of the list.
    setTodoList((previousTodoList) => [newTodo, ...previousTodoList]);
  }

  function completeTodo(id) {
    // Mark the selected todo as completed.
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );
  }

  function updateTodo(editedTodo) {
    // Replace only the todo that matches the edited todo's id.
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
      )
    );
  }

  return (
    <div>
      <h1>My Todos</h1>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;