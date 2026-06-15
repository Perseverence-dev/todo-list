import './App.css';
import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  // Store all todos in state.
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const trimmedTitle = todoTitle.trim();

    // Guard against empty submissions.
    if (!trimmedTitle) {
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: trimmedTitle,
      isCompleted: false,
    };

    // Functional updates are safer when the new state depends on previous state.
    setTodoList((previousTodoList) => [newTodo, ...previousTodoList]);
  }

  function completeTodo(id) {
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;