import { useMemo } from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList, dataVersion, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = useMemo(() => {
    // Lesson 8: useMemo avoids recalculating this list unless todos or dataVersion change.
    return {
      version: dataVersion,
      todos: todoList.filter((todo) => !todo.isCompleted),
    };
  }, [todoList, dataVersion]);

  if (filteredTodoList.todos.length === 0) {
    return <p>Add todo above to get started</p>;
  }

  return (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;