import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('App imported:', App);


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600">
          <h1>Something went wrong.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('Main.jsx starting execution');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);

  if (!rootElement) {
    console.error('CRITICAL: Root element not found!');
  } else {
    const root = createRoot(rootElement);
    console.log('Root created, attempting to render App');

    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
    console.log('Render scheduled');
  }
} catch (error) {
  console.error('CRITICAL ERROR in main.jsx:', error);
}
