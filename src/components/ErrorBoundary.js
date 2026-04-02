import React from 'react';

/**
 * ErrorBoundary - Catches rendering errors in child components
 * Displays a fallback UI when an error occurs
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h2 className="error-boundary__title">
              {this.props.errorTitle || 'Что-то пошло не так'}
            </h2>
            <p className="error-boundary__message">
              {this.props.errorMessage || 'Произошла ошибка при отображении контента.'}
            </p>
            {this.props.showDetails && this.state.error && (
              <details className="error-boundary__details">
                <summary>Подробности ошибки</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            {this.props.showReset && (
              <button 
                className="error-boundary__reset" 
                onClick={this.handleReset}
                type="button"
              >
                Попробовать снова
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
