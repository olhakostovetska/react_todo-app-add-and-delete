import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  errorMessage: string;
  onDelete: (todoId: number) => Promise<void>;
  onSelect: React.Dispatch<React.SetStateAction<Todo | null>>;
  selectedTodoId: number | undefined;
  tempTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  selectedTodoId,
}) => {
  const { id, completed } = todo;
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
      {/* Додаємо чекбокс зі статусом */}
      <input
        type="checkbox"
        className="todo__status"
        data-cy="TodoStatus"
        checked={completed}
        readOnly
      />

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title.trim()}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': id === 0 })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
