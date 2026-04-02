import React, { useEffect, useState } from 'react';
import '../styles/scss/components/_notification.scss';

/**
 * Notification component for displaying user feedback
 * Supports success, error, warning, and info types
 * Can auto-close after a duration or require manual dismissal
 * Supports action buttons (e.g., "Retry")
 */
const Notification = ({ 
  type = 'info', 
  message, 
  duration = null, 
  onClose, 
  action = null 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleAction = () => {
    if (action && action.onClick) {
      action.onClick();
    }
  };

  if (!isVisible) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification notification--${type}`} role="alert">
      <div className="notification__icon">
        {getIcon()}
      </div>
      <div className="notification__content">
        <p className="notification__message">{message}</p>
        {action && (
          <button 
            className="notification__action" 
            onClick={handleAction}
            type="button"
          >
            {action.label}
          </button>
        )}
      </div>
      <button 
        className="notification__close" 
        onClick={handleClose}
        aria-label="Закрыть уведомление"
        type="button"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
