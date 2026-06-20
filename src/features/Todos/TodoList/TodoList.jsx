import { useMemo } from 'react';
import TodoListItem from './TodoListItem';

function TodoList({
  todoList,
  dataVersion,
  onCompleteTodo,
  onUpdateTodo,
  statusFilter = 'all',
}) {
  const filteredTodoList = useMemo(() => {
    // Lesson 8: useMemo avoids recalculating this list unless its inputs change.
    // Week 10: the visible set now depends on the URL-driven status filter.
    let todos;
    switch (statusFilter) {
      case 'completed':
        todos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        todos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        todos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos,
    };
  }, [todoList, dataVersion, statusFilter]);

  // Context-aware empty message so the user understands why the list is empty.
  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet.';
      case 'active':
        return 'No active todos. Add a todo above to get started.';
      case 'all':
      default:
        return 'Add todo above to get started';
    }
  };

  if (filteredTodoList.todos.length === 0) {
    return <p>{getEmptyMessage()}</p>;
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