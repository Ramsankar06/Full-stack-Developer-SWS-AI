import { Component } from 'react';

class ErrorBoundary extends Component {
    state = {
        error: null,
    };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('React render failed', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
                    <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-red-700">DocHub could not render</h1>
                        <p className="mt-3 text-sm text-gray-600">
                            React hit a runtime error while starting the dashboard.
                        </p>
                        <pre className="mt-4 overflow-auto rounded-md bg-gray-950 p-4 text-sm text-white">
                            {this.state.error.message}
                        </pre>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
