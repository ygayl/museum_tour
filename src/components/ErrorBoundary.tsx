import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleClearData = () => {
    try {
      // Clear all localStorage
      localStorage.clear();
      // Clear all sessionStorage
      sessionStorage.clear();
      // Reload the page
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear data:', e);
      alert('Failed to clear data. Please clear your browser cache manually.');
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{
            maxWidth: '600px',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1a365d',
              marginBottom: '16px',
            }}>
              Something went wrong
            </h1>

            <p style={{
              color: '#6b7280',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}>
              The app encountered an error. This usually happens when there's corrupted data in your browser.
              Click the button below to clear all app data and reload.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={this.handleClearData}
                style={{
                  backgroundColor: '#d4a574',
                  color: '#1a365d',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '10px',
                }}
              >
                Clear Data & Reload
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Just Reload
              </button>
            </div>

            {this.state.error && (
              <details style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                fontSize: '12px',
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#991b1b',
                  marginBottom: '8px',
                }}>
                  Error Details (for debugging)
                </summary>
                <div style={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#7f1d1d',
                }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      <br /><br />
                      <strong>Stack:</strong>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
