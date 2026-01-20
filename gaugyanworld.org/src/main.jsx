import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PluginProvider } from './context/PluginContext';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

console.log('Rendering App component...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/">
        <AuthProvider>
          <DataProvider>
            <PluginProvider>
              <CurrencyProvider>
                <App />
              </CurrencyProvider>
            </PluginProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
