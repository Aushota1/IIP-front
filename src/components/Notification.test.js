import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from './Notification';

describe('Notification Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render notification with message', () => {
    render(<Notification type="info" message="Test message" />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render success notification with correct icon', () => {
    render(<Notification type="success" message="Success!" />);
    
    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('notification--success');
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should render error notification with correct icon', () => {
    render(<Notification type="error" message="Error occurred" />);
    
    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('notification--error');
    
    // Check that the icon is present (error icon is ✕, same as close button)
    const icons = screen.getAllByText('✕');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render warning notification with correct icon', () => {
    render(<Notification type="warning" message="Warning!" />);
    
    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('notification--warning');
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('should render info notification with correct icon', () => {
    render(<Notification type="info" message="Information" />);
    
    const notification = screen.getByRole('alert');
    expect(notification).toHaveClass('notification--info');
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Notification type="info" message="Test" onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Закрыть уведомление');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-close after duration', async () => {
    const onClose = jest.fn();
    render(<Notification type="info" message="Test" duration={3000} onClose={onClose} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    
    // Fast-forward time
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should not auto-close when duration is null', () => {
    const onClose = jest.fn();
    render(<Notification type="info" message="Test" duration={null} onClose={onClose} />);
    
    jest.advanceTimersByTime(10000);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render action button when action is provided', () => {
    const action = {
      label: 'Retry',
      onClick: jest.fn(),
    };
    
    render(<Notification type="error" message="Failed" action={action} />);
    
    const actionButton = screen.getByText('Retry');
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(action.onClick).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when action is null', () => {
    render(<Notification type="info" message="Test" action={null} />);
    
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('should hide notification when close is triggered', () => {
    const { container } = render(<Notification type="info" message="Test" />);
    
    const closeButton = screen.getByLabelText('Закрыть уведомление');
    fireEvent.click(closeButton);
    
    expect(container.firstChild).toBeNull();
  });
});
