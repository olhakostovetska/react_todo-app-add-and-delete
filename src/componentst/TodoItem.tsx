/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  errorMessage: string;
  onDelete: (todoId: number) => Promise<void>;
  onSelect: React.Dispatch<React.SetStateAction<Todo | null>>;
  selectedTodoId: number | undefined;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  selectedTodoId,
}) => {
  const { id, title, completed } = todo;
  const [, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(id);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
        selected: selectedTodoId === id,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={id}
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
