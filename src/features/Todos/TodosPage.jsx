import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import { isValidTodoTitle } from '../../utils/todoValidation';

// This page is accessible only after authentication, so it receives the auth token as a prop.
/**
 * Returns the task object from different possible API response shapes.
 * This makes the component safer if the API returns { task: {...} } or {...}.
 */
function getTaskFromResponse(data) {
  return data.task || data;
}

/**
 * TodosPage owns all todo-related state and API operations.
 * It fetches todos after authentication and uses optimistic updates
 * for add, complete, and edit operations.
 */
function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    async function fetchTodos() {
      try {
        setIsTodoListLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized. Please log on again.');
        }

        if (!response.ok) {
          throw new Error('Unable to load todos.');
        }

        const data = await response.json();

        if (isMounted) {
          setTodoList(data.tasks || []);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsTodoListLoading(false);
        }
      }
    }

    fetchTodos();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function addTodo(todoTitle) {
    const trimmedTitle = todoTitle.trim();

    if (!isValidTodoTitle(trimmedTitle)) {
      return;
    }

    // Temporary todo appears immediately for a better user experience.
    const temporaryTodo = {
      id: `temporary-${Date.now()}`,
      title: trimmedTitle,
      isCompleted: false,
    };

    setError('');
    setTodoList((previousTodoList) => [temporaryTodo, ...previousTodoList]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: trimmedTitle,
          isCompleted: false,
        }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log on again.');
      }

      if (!response.ok) {
        throw new Error('Unable to add todo.');
      }

      const data = await response.json();
      const savedTodo = getTaskFromResponse(data);

      // Replace the temporary todo with the real database todo.
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === temporaryTodo.id ? savedTodo : todo
        )
      );
    } catch (error) {
      // Roll back the optimistic add if the API fails.
      setTodoList((previousTodoList) =>
        previousTodoList.filter((todo) => todo.id !== temporaryTodo.id)
      );
      setError(error.message);
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    const completedTodo = {
      ...originalTodo,
      isCompleted: true,
    };

    setError('');

    // Optimistically mark the todo as completed.
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) => (todo.id === id ? completedTodo : todo))
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true,
          //When you send a PATCH request, the API only wants fields that are being updated. createdAt: originalTodo.createdAt which is a system-generated field and should not be modified. The server likely rejects or ignores updates when createdAt is included.
          //createdAt: originalTodo.createdAt,
        }),
      });git 

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log on again.');
      }

      if (!response.ok) {
        throw new Error('Unable to complete todo.');
      }

      const data = await response.json();
      const savedTodo = getTaskFromResponse(data);

      // Use the server response if it returns the updated todo.
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) => (todo.id === id ? savedTodo : todo))
      );
    } catch (error) {
      // Roll back to the original todo if the API update fails.
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
      setError(error.message);
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    if (!originalTodo) {
      return;
    }

    const trimmedTitle = editedTodo.title.trim();

    if (!isValidTodoTitle(trimmedTitle)) {
      return;
    }

    const updatedTodo = {
      ...editedTodo,
      title: trimmedTitle,
    };

    setError('');

    // Optimistically update the title in the UI.
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${updatedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: updatedTodo.title,
          isCompleted: updatedTodo.isCompleted,
                    
        }),
      }); 

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log on again.');
      }

      if (!response.ok) {
        throw new Error('Unable to update todo.');
      }

      const data = await response.json();
      const savedTodo = getTaskFromResponse(data);

      // Replace optimistic value with the server-confirmed value.
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === updatedTodo.id ? savedTodo : todo
        )
      );
    } catch (error) {
      // Roll back to the original todo if the API update fails.
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );
      setError(error.message);
    }
  }

  return (
    <main>
      {error && (
        <section>
          <p>{error}</p>
          <button type="button" onClick={() => setError('')}>
            Clear Error
          </button>
        </section>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </main>
  );
}

export default TodosPage;