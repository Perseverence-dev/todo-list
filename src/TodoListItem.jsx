function TodoListItem({ todo }) {
  return (
    <li>
      {/* Show the title of one todo item */}
      {todo.title}
    </li>
  );
}

export default TodoListItem;
