import { useCallback, useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import { isValidTodoTitle } from '../../utils/todoValidation';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';

/**
 * Returns the task object from different possible API response shapes.
 * This makes the component safer if the API returns { task: {...} } or {...}.
 */
function getTaskFromResponse(data) {
  return data.task || data;
}

/**
 * TodosPage owns all todo-related state and API operations.
 * Lesson 8 adds server-side sorting, debounced search, useCallback,
 * cache invalidation, and filter-specific error recovery.
 */
function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  // Lesson 8: These values are sent to the API so sorting happens server-side.
  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Lesson 8: filterTerm updates immediately, but debouncedFilterTerm updates after 300ms.
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  // Lesson 8: dataVersion helps child components know when memoized todo data should refresh.
  const [dataVersion, setDataVersion] = useState(0);

  // Lesson 8: useCallback keeps this function stable and uses functional state update.
  const invalidateCache = useCallback(() => {
    setDataVersion((previousVersion) => previousVersion + 1);
  }, []);

  function handleFilterChange(newFilterTerm) {
    setFilterTerm(newFilterTerm);
  }

  const fetchTodos = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setIsTodoListLoading(true);
      setError('');

      // Lesson 8: URLSearchParams safely builds the query string for sort/search.
      const paramsObject = {
        sortBy,
        sortDirection,
      };

      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }

      const params = new URLSearchParams(paramsObject);

      const response = await fetch(`/api/tasks?${params}`, {
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

      setTodoList(data.tasks || []);
      setFilterError('');
    } catch (error) {
      // Lesson 8: show a separate recovery path for sort/search errors.
      if (
        debouncedFilterTerm ||
        sortBy !== 'creationDate' ||
        sortDirection !== 'desc'
      ) {
        setFilterError(`Error filtering/sorting todos: ${error.message}`);
      } else {
        setError(`Error fetching todos: ${error.message}`);
      }
    } finally {
      setIsTodoListLoading(false);
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function addTodo(todoTitle) {
    const trimmedTitle = todoTitle.trim();

    if (!isValidTodoTitle(trimmedTitle)) {
      return;
    }

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

      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === temporaryTodo.id ? savedTodo : todo
        )
      );

      // Lesson 8: mutation succeeded, so refresh memoized todo calculations.
      invalidateCache();
    } catch (error) {
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
          // Only send the field being updated. Do not send createdAt.
          isCompleted: true,
        }),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log on again.');
      }

      if (!response.ok) {
        throw new Error('Unable to complete todo.');
      }

      const data = await response.json();
      const savedTodo = getTaskFromResponse(data);

      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) => (todo.id === id ? savedTodo : todo))
      );

      // Lesson 8: mutation succeeded, so refresh memoized todo calculations.
      invalidateCache();
    } catch (error) {
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
          // Send editable fields only. createdAt is generated by the server.
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

      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === updatedTodo.id ? savedTodo : todo
        )
      );

      // Lesson 8: mutation succeeded, so refresh memoized todo calculations.
      invalidateCache();
    } catch (error) {
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

      {filterError && (
        <section>
          <p>{filterError}</p>

          <button type="button" onClick={() => setFilterError('')}>
            Clear Filter Error
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterTerm('');
              setSortBy('creationDate');
              setSortDirection('desc');
              setFilterError('');
            }}
          >
            Reset Filters
          </button>
        </section>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </main>
  );
}

export default TodosPage;