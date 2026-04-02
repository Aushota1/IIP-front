import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from './Notification';
import '../styles/scss/components/_notification.scss';

/**
 * Context for managing notifications globally
 */
const NotificationContext = createContext();

/**
 * Hook to access notification functions
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

/**
 * NotificationProvider - Provides notification functionality to the app
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((config) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      type: config.type || 'info',
      message: config.message,
      duration: config.duration,
      action: config.action,
    };

    setNotifications((prev) => [...prev, notification]);

    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    return showNotification({ type: 'success', message, duration });
  }, [showNotification]);

  const showError = useCallback((message, action = null) => {
    return showNotification({ type: 'error', message, action });
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 5000) => {
    return showNotification({ type: 'warning', message, duration });
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 3000) => {
    return showNotification({ type: 'info', message, duration });
  }, [showNotification]);

  const value = {
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            action={notification.action}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
