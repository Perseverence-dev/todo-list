import { useMemo } from 'react';
import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({
  todoList,
  dataVersion,
  onCompleteTodo,
  onUpdateTodo,
  statusFilter = 'all',
}) {
  const filteredTodoList = useMemo(() => {
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
    return <p className={styles.empty}>{getEmptyMessage()}</p>;
  }

  return (
    <ul className={styles.list}>
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