import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getPreparedTodos } from './utils/todoFilter';
import * as todoService from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import { TodoForm } from './componentst/TodoForm';
import { TodoList } from './componentst/TodoList';
import { Footer } from './componentst/Footer';
import { Notification } from './componentst/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterBy, setFilterBy] = useState(Filter.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [titleError, setTitleError] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preparedTodos = getPreparedTodos(todos, filterBy);
  const completedTodos = todos.filter(todo => todo.completed);
  const todoCount = todos.length - completedTodos.length;

  const loadTodos = () => {
    setErrorMessage('');
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  useEffect(loadTodos, []);

  if (!todoService) {
    return <UserWarning />;
  }

  const handleTitleError = (title: string) => {
    if (title.trim() === '') {
      setTitleError('Title should not be empty');
      setTimeout(() => {
        setTitleError('');
      }, 3000);
    } else {
      setTitleError('');
    }
  };

  async function addTodo(todo: Omit<Todo, 'id'>) {
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: todo.title,
      completed: false,
      userId: todo.userId,
    });

    try {
      const newTodo = await todoService.addTodo(todo);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTempTodo(null);
      setTitleError('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteTodo(todoId: number): Promise<void> {
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }

  function clearCompleted() {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    Promise.all(
      completedTodosIds.map(todoId =>
        todoService.deleteTodo(todoId).catch(() => {
          setErrorMessage('Unable to delete one or more todos');
        }),
      ),
    ).then(() => {
      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={todos}
            onTitleChange={handleTitleError}
            onSubmit={addTodo}
            onReset={() => setSelectedTodo(null)}
            isSubmitting={isSubmitting}
            titleError={titleError}
            tempTodo={tempTodo}
          />
        </header>

        {tempTodo && (
          <div className="temp-todo">
            <span>{tempTodo.title}</span>
          </div>
        )}

        <TodoList
          preparedTodos={preparedTodos}
          errorMessage={errorMessage}
          onDelete={deleteTodo}
          onSelect={setSelectedTodo}
          selectedTodoId={selectedTodo?.id}
        />

        {!errorMessage && (
          <Footer
            todos={todos}
            errorMessage={errorMessage}
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            todoCount={todoCount}
            completedTodos={completedTodos}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage || titleError}
        onClose={() => {
          setErrorMessage('');
          setTitleError('');
        }}
      />
    </div>
  );
};
