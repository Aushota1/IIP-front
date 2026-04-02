import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error for these tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should render fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
    expect(screen.getByText('Произошла ошибка при отображении контента.')).toBeInTheDocument();
  });

  it('should render custom error title and message', () => {
    render(
      <ErrorBoundary
        errorTitle="Custom Error Title"
        errorMessage="Custom error message"
      >
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should show error details when showDetails is true', () => {
    render(
      <ErrorBoundary showDetails={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Подробности ошибки')).toBeInTheDocument();
  });

  it('should not show error details when showDetails is false', () => {
    render(
      <ErrorBoundary showDetails={false}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.queryByText('Подробности ошибки')).not.toBeInTheDocument();
  });

  it('should show reset button when showReset is true', () => {
    render(
      <ErrorBoundary showReset={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
  });

  it('should not show reset button when showReset is false', () => {
    render(
      <ErrorBoundary showReset={false}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.queryByText('Попробовать снова')).not.toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should reset error state when reset button is clicked', () => {
    const onReset = jest.fn();
    
    render(
      <ErrorBoundary showReset={true} onReset={onReset}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
    
    const resetButton = screen.getByText('Попробовать снова');
    fireEvent.click(resetButton);
    
    // Verify onReset was called
    expect(onReset).toHaveBeenCalledTimes(1);
    
    // After reset, the error boundary state is cleared
    // The parent component would need to handle re-rendering with fixed children
  });

  it('should call onReset callback when reset is triggered', () => {
    const onReset = jest.fn();
    
    render(
      <ErrorBoundary showReset={true} onReset={onReset}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const resetButton = screen.getByText('Попробовать снова');
    fireEvent.click(resetButton);
    
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should render custom fallback UI', () => {
    const customFallback = <div>Custom fallback UI</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
    expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument();
  });
});
