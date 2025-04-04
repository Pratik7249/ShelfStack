import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

// Handle global errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the message port closed error from showing in console
  if (event.message && event.message.includes('message port closed')) {
    event.preventDefault();
  }
});

// Create error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="mb-4">The application encountered an error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = createRoot(document.getElementById("root"));

root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);

// Clean up function to handle component unmounting
const cleanup = () => {
  // Remove any event listeners or cleanup any resources
  window.removeEventListener('error', () => {});
};

// Add cleanup on page unload
window.addEventListener('unload', cleanup);
