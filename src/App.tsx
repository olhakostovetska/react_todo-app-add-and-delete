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
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preparedTodos = getPreparedTodos(todos, filterBy);
  const completedTodos = todos.filter(todo => todo.completed);
  const todoCount = todos.length - completedTodos.length;

  // Функція для показу помилки
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = () => {
    showError(''); // Очищуємо помилки перед запитом
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  };

  useEffect(loadTodos, []);

  if (!todoService) {
    return <UserWarning />;
  }

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
      showError('');
    } catch (error) {
      showError('Unable to add a todo');
      setTempTodo(null); // Видаляємо тимчасове todo у випадку помилки
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteTodo(todoId: number): Promise<void> {
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    }
  }

  function clearCompleted() {
    const completedTodosIds = completedTodos.map(todo => todo.id);

    Promise.all(
      completedTodosIds.map(todoId =>
        todoService.deleteTodo(todoId).catch(() => {
          showError('Unable to delete one or more todos');
        }),
      ),
    ).then(() => {
      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
    });
  }

  const showFooter = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={todos}
            onSubmit={addTodo}
            isSubmitting={isSubmitting}
            tempTodo={tempTodo}
            showError={showError} // Передаємо нову функцію
          />
        </header>

        <TodoList
          preparedTodos={preparedTodos}
          errorMessage={errorMessage}
          onDelete={deleteTodo}
          onSelect={setSelectedTodo}
          selectedTodoId={selectedTodo?.id}
          tempTodo={tempTodo}
        />

        {showFooter && (
          <Footer
            errorMessage={errorMessage} // Додаємо errorMessage
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            todoCount={todoCount}
            completedTodos={completedTodos}
            onClearCompleted={clearCompleted}
            showFooter={showFooter} // Додаємо showFooter
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
