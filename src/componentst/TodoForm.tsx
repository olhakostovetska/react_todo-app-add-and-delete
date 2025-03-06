import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  tempTodo: Todo | null;
  setErrorMessage: (message: string) => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onSubmit,
  isSubmitting,
  tempTodo,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    onSubmit({ title, completed: false, userId: USER_ID })
      .then(() => {
        setTitle('');
        setErrorMessage('');
      })
      .catch(() => {});
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          disabled={isSubmitting}
        />
      </form>

      {tempTodo && (
        <div className="temp-todo">
          <span>{tempTodo.title}</span>
        </div>
      )}
    </>
  );
};
