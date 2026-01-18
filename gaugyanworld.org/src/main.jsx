import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext.jsx'

import ErrorBoundary from './components/ErrorBoundary.jsx'

import { HelmetProvider } from 'react-helmet-async';

// ...

console.log("main.jsx: Initializing React App...");
console.log("DEBUG: main.jsx - Starting...");
console.log("DEBUG: main.jsx - Root element:", document.getElementById('root'));

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <CurrencyProvider>
              <App />
            </CurrencyProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </HelmetProvider>
    </React.StrictMode>,
  )
} catch (error) {
  console.error("CRITICAL: React Mount Failed", error);
}
