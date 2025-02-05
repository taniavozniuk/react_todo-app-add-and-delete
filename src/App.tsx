/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodos, getTodos, postTodos } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';
import { ErrorMessange } from './component/ErrorMessange';
import { Status } from './types/statys';
import { TodoList } from './component/TodoList';
import { Footer } from './component/Footer';
import { TempTodo } from './component/TempTodo';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [itemLeft, setItemLeft] = useState(0);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const loadTodos = () => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current && tempTodo === null) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    setItemLeft(todos.filter(todo => !todo.completed).length);
  }, [todos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    postTodos(newTempTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
        setError('');
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTitle(title);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingTodoId(id);
    setIsLoading(true);
    setError('');
    const todoDelete = todos.find(todo => todo.id === id);

    if (!todoDelete) {
      return;
    }

    deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setError('');
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodoId(null);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 3000);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);
    setError('');

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.ACTIVE) {
      return !todo.completed;
    }

    if (filter === Status.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo focused"
              placeholder="Title should not be empty"
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading}
              ref={inputRef}
            />
          </form>
        </header>

        <TodoList
          filteredTodos={filteredTodos}
          toggleTodo={toggleTodo}
          handleDelete={handleDelete}
          loadingTodoId={loadingTodoId}
        />

        {tempTodo && <TempTodo tempTodo={tempTodo} />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            itemLeft={itemLeft}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessange message={error} onClose={() => setError('')} />
    </div>
  );
};
