/**
 * Example usage of the Notification system
 * 
 * This file demonstrates how to use the NotificationProvider and useNotification hook
 * to display notifications in your React application.
 */

import React from 'react';
import { NotificationProvider, useNotification } from './NotificationContainer';
import { NetworkError, APIError } from '../errors';

/**
 * Example 1: Basic notification usage
 */
function BasicExample() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleSuccess = () => {
    showSuccess('Операция выполнена успешно!');
  };

  const handleError = () => {
    showError('Произошла ошибка при выполнении операции');
  };

  const handleWarning = () => {
    showWarning('Внимание! Это предупреждение');
  };

  const handleInfo = () => {
    showInfo('Информационное сообщение');
  };

  return (
    <div>
      <h2>Basic Notifications</h2>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}

/**
 * Example 2: Notification with action button
 */
function NotificationWithAction() {
  const { showError } = useNotification();

  const handleNetworkError = () => {
    showError('Ошибка сети. Проверьте подключение к интернету.', {
      label: 'Повторить',
      onClick: () => {
        console.log('Retrying...');
        // Retry the failed operation
      },
    });
  };

  return (
    <div>
      <h2>Notification with Action</h2>
      <button onClick={handleNetworkError}>Simulate Network Error</button>
    </div>
  );
}

/**
 * Example 3: Custom notification with duration
 */
function CustomDurationExample() {
  const { showNotification } = useNotification();

  const handleCustomNotification = () => {
    showNotification({
      type: 'info',
      message: 'Это уведомление исчезнет через 10 секунд',
      duration: 10000, // 10 seconds
    });
  };

  const handlePersistentNotification = () => {
    showNotification({
      type: 'warning',
      message: 'Это уведомление не исчезнет автоматически',
      duration: null, // No auto-close
    });
  };

  return (
    <div>
      <h2>Custom Duration</h2>
      <button onClick={handleCustomNotification}>10 Second Notification</button>
      <button onClick={handlePersistentNotification}>Persistent Notification</button>
    </div>
  );
}

/**
 * Example 4: Error handling with notifications
 */
function ErrorHandlingExample() {
  const { showError, showSuccess } = useNotification();

  const handleAPICall = async () => {
    try {
      // Simulate API call
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new APIError(response.status, 'Failed to fetch data');
      }
      
      showSuccess('Данные успешно загружены');
    } catch (error) {
      if (error instanceof NetworkError) {
        showError('Ошибка сети. Проверьте подключение к интернету.', {
          label: 'Повторить',
          onClick: handleAPICall,
        });
      } else if (error instanceof APIError) {
        if (error.status === 401) {
          showError('Необходима авторизация');
        } else if (error.status === 403) {
          showError('У вас нет прав для выполнения этого действия');
        } else if (error.status === 422) {
          showError('Ошибка валидации данных');
        } else {
          showError(`Ошибка сервера: ${error.message}`);
        }
      } else {
        showError('Произошла неизвестная ошибка');
      }
    }
  };

  return (
    <div>
      <h2>Error Handling</h2>
      <button onClick={handleAPICall}>Make API Call</button>
    </div>
  );
}

/**
 * Example 5: Integration with form submission
 */
function FormExample() {
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Simulate form submission
      const formData = new FormData(event.target);
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new APIError(response.status, error.message, error.details);
      }

      showSuccess('Форма успешно отправлена!', 3000);
      event.target.reset();
    } catch (error) {
      if (error instanceof APIError && error.status === 422) {
        // Show validation errors
        const errors = error.details?.errors || [];
        const errorMessage = errors.map(e => `${e.field}: ${e.message}`).join(', ');
        showError(`Ошибка валидации: ${errorMessage}`);
      } else {
        showError('Не удалось отправить форму. Попробуйте позже.');
      }
    }
  };

  return (
    <div>
      <h2>Form Submission</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

/**
 * Main App component with NotificationProvider
 */
function App() {
  return (
    <NotificationProvider>
      <div className="app">
        <h1>Notification System Examples</h1>
        <BasicExample />
        <NotificationWithAction />
        <CustomDurationExample />
        <ErrorHandlingExample />
        <FormExample />
      </div>
    </NotificationProvider>
  );
}

export default App;
