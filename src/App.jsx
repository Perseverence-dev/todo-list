import './App.css';
import { useState } from 'react'; // useState lets us track data that changes over time
import TodoList from './TodoList';
import TodoForm from './TodoForm';

//Week-4 Homework copy
function App() {
  
  //Store a list of todos in state. We will add to this list when the user submits a new todo from the form. We will also pass this list down to the TodoList component so it can display the todos.
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
    };

    // use the previous state to build the new array. This is important because state updates are asynchronous, and if we were to use the current value of todoList directly, it might not reflect the most recent changes. By using a function that takes the previous state as an argument, we ensure that we are working with the most up-to-date version of the todo list when adding a new todo.
    setTodoList((previous) => [newTodo, ...previous]);
  }

  return (
    <div>
      <h1>My Todos</h1>

      <TodoForm onAddTodo={addTodo} />

      <TodoList todoList={todoList} />      
    </div>
  );
}

export default App;