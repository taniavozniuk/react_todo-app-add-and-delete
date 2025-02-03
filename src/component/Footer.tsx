import React from 'react';
import { Todo } from '../types/Todo';
import { Statys } from '../types/statys';

interface Props {
  itemLeft: number;
  filter: Statys;
  setFilter: (filter: Statys) => void;
  todos: Todo[];
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  itemLeft,
  filter,
  setFilter,
  todos,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {itemLeft} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === Statys.ALL ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Statys.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filter === Statys.ACTIVE ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Statys.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filter === Statys.COMPLETED ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Statys.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!todos.some(todo => todo.completed)}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
