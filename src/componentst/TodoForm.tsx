import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  tempTodo: Todo | null;
  showError: (message: string) => void; // Оновлюємо тип пропсів
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onSubmit,
  isSubmitting,
  tempTodo,
  showError, // Отримуємо функцію
}) => {
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      showError('Title should not be empty');

      return;
    }

    onSubmit({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(() => {
        setTitle('');
      })
      .catch(() => {}); // Помилки обробляються в App.tsx
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
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
          onChange={e => setTitle(e.target.value)}
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
