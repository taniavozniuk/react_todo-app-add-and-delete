import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  filteredTodos: Todo[];
  toggleTodo: (id: number) => void;
  handleDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  toggleTodo,
  handleDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <div
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''} ${todo.id === 0 ? 'temp' : ''} `}
        key={todo.id}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            disabled={todo.id === 0} //!!!
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={todo.id === 0} //!!!
          onClick={() => {
            handleDelete(todo.id);
          }}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        {todo.id === 0 && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    ))}
  </section>
);
