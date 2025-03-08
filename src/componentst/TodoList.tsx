import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  preparedTodos: Todo[];
  errorMessage: string;
  onDelete: (todoId: number) => Promise<void>;
  onSelect: React.Dispatch<React.SetStateAction<Todo | null>>;
  selectedTodoId: number | undefined;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  errorMessage,
  onDelete,
  onSelect,
  selectedTodoId,
  tempTodo,
}) => {
  const todosToRender = tempTodo ? [...preparedTodos, tempTodo] : preparedTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToRender.map(todo => (
        <TodoItem
          key={todo.id || 'temp'}
          todo={todo}
          errorMessage={errorMessage}
          onDelete={onDelete}
          onSelect={onSelect}
          selectedTodoId={selectedTodoId}
          tempTodoId={tempTodo?.id ?? null}
        />
      ))}
    </section>
  );
};
