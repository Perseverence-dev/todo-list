import { useCallback, useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import { isValidTodoTitle } from '../utils/todoValidation';
import SortBy from '../shared/SortBy';
import FilterInput from '../shared/FilterInput';
import StatusFilter from '../shared/StatusFilter';
import useDebounce from '../utils/useDebounce';
import {
  TODO_ACTIONS,
  initialTodoState,
  todoReducer,
} from '../reducers/todoReducer';
import { useAuth } from '../contexts/useAuth';

// Week 9: Dispatch actions describe state changes instead of directly mutating state.
// Week 10: moved into /pages and reads the status filter from the URL.

/**
 * Returns the task object from different possible API response shapes.
 */
function getTaskFromResponse(data) {
  return data.task || data;
}

function TodosPage() {
  const { token } = useAuth();

  // Week 10: the status filter lives in the URL so it's shareable/bookmarkable.
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  // Week 9: useReducer centralizes all related todo state updates in one predictable reducer.
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  function handleFilterChange(newFilterTerm) {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newFilterTerm },
    });
  }

  const fetchTodos = useCallback(async () => {
    if (!token) {
      return;
    }

    dispatch({ type: TODO_ACTIONS.FETCH_START });

    try {
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

      dispatch({
        type: TODO_ACTIONS.FETCH_SUCCESS,
        payload: { todoList: data.tasks || [] },
      });
    } catch (error) {
      const isFilterRequest =
        debouncedFilterTerm ||
        sortBy !== 'creationDate' ||
        sortDirection !== 'desc';

      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: {
          message: isFilterRequest
            ? `Error filtering/sorting todos: ${error.message}`
            : `Error fetching todos: ${error.message}`,
          isFilterError: Boolean(isFilterRequest),
        },
      });
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

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { temporaryTodo },
    });

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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          temporaryId: temporaryTodo.id,
          savedTodo,
        },
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          temporaryId: temporaryTodo.id,
          message: error.message,
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id },
    });

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

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: { savedTodo },
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
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

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { updatedTodo },
    });

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

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: { savedTodo },
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }

  return (
    <main>
      {error && (
        <section>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </section>
      )}

      {filterError && (
        <section>
          <p>{filterError}</p>

          <button
            type="button"
            onClick={() =>
              dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })
            }
          >
            Clear Filter Error
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </section>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: newSortBy, sortDirection },
          })
        }
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy, sortDirection: newSortDirection },
          })
        }
      />

      {/* Week 10: URL-backed status filter (all / active / completed). */}
      <StatusFilter />

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
        statusFilter={statusFilter}
      />
    </main>
  );
}

export default TodosPage;
