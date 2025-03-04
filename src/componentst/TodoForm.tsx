import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  onTitleChange: (title: string) => void;
  onSubmit: (todo: Omit<Todo, 'id'>) => void;
  onReset: () => void;
  isSubmitting: boolean;
  titleError: string;
  tempTodo: Todo | null;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onTitleChange,
  onSubmit,
  isSubmitting,
  titleError,
  tempTodo,
}) => {
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      onTitleChange(title);

      return;
    }

    onSubmit({ title, completed: false, userId: USER_ID });
    setTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (title.trim() !== '') {
        onSubmit({ title, completed: false, userId: USER_ID });
        setTitle('');
      } else {
        onTitleChange(title);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
          <div className="loader">Loading...</div>
        </div>
      )}

      {titleError && <div className="error">{titleError}</div>}
    </>
  );
};
