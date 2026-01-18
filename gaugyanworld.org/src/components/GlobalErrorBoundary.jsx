import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        // Log error to backend service or analytics here
        console.error("Uncaught Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-red-100 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAlertTriangle className="text-red-500 text-3xl" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-6">
                            Our AI diagnostic system has detected an unexpected issue. We've logged this report.
                        </p>

                        {this.props.showDetails && this.state.error && (
                            <div className="text-left bg-gray-900 text-red-300 p-4 rounded-lg text-xs font-mono overflow-auto max-h-48 mb-6">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <FiRefreshCw className="mr-2" /> Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
