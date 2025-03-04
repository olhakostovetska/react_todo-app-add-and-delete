import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  setFilterBy: Dispatch<SetStateAction<Filter>>;
  filterBy: Filter;
  todoCount: number;
  completedTodos: Todo[];
  onClearCompleted: () => void;
  showFooter: boolean;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  todoCount,
  completedTodos,
  onClearCompleted,
  showFooter,
}) => {
  if (!showFooter) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todoCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(item => (
          <a
            href={`#/${item}`}
            key={item}
            className={cn('filter__link', { selected: filterBy === item })}
            data-cy={`FilterLink${item}`}
            onClick={() => setFilterBy(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
