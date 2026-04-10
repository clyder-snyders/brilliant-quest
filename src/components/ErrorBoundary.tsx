import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents entire app from crashing when a component throws an error
 * Provides recovery options and error details for debugging
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Log to localStorage for debugging if page is reloaded
    try {
      const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
      errorLog.push({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
      });
      localStorage.setItem('errorLog', JSON.stringify(errorLog.slice(-10)));
    } catch (e) {
      console.error('Failed to log error:', e);
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log detailed error information for debugging
    console.error('[Error Boundary] Component crashed:', error);
    console.error('[Error Boundary] Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center p-4" style={{ background: 'hsl(220, 27%, 98%)' }}>
          <div className="max-w-md rounded-xl p-6 text-center" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'hsl(0, 84%, 60%)' }}>
              ⚠️ Something went wrong
            </h1>
            <p className="mb-2 text-sm" style={{ color: 'hsl(215, 16%, 47%)' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-4 text-left text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>
                <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                style={{
                  background: 'hsl(217, 91%, 60%)',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'hsl(217, 91%, 50%)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'hsl(217, 91%, 60%)'; }}
                aria-label="Refresh the page to reload the application"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                style={{
                  background: 'hsl(220, 33%, 95%)',
                  color: 'hsl(217, 33%, 17%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  cursor: 'pointer',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'hsl(220, 33%, 90%)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'hsl(220, 33%, 95%)'; }}
                aria-label="Try to recover from the error"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
