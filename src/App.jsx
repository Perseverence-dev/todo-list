import './App.css';
import { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const todos = [
    { id: 1, title: 'review resources' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'code out app' },
  ] 

function App() {
  
  const [todoList, setTodoList] = useState(todos);

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList />      
    </div>
  )
}

export default App