import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  preparedTodos: Todo[];
  errorMessage: string;
  onDelete: (todoId: number) => Promise<void>;
  onSelect: React.Dispatch<React.SetStateAction<Todo | null>>;
  selectedTodoId: number | undefined;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  errorMessage,
  onDelete,
  onSelect,
  selectedTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          errorMessage={errorMessage}
          onDelete={onDelete}
          onSelect={onSelect}
          selectedTodoId={selectedTodoId}
        />
      ))}
    </section>
  );
};
