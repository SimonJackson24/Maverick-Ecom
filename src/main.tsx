import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { client } from './apollo';
import { theme } from './theme';
import App from './App';
import './index.css';

async function startApp() {
  try {
    if (import.meta.env.MODE === 'development') {
      try {
        const { startWorker } = await import('./mocks/browser');
        await startWorker();
      } catch (error) {
        console.error('Failed to start MSW:', error);
        // Continue rendering the app even if MSW fails
      }
    }

    const root = document.getElementById('root');
    if (!root) {
      throw new Error('Root element not found');
    }

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ApolloProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to start application:', error);
    // Show error to user
    document.body.innerHTML = `
      <div style="color: red; padding: 20px;">
        <h1>Application Error</h1>
        <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `;
  }
}

startApp();
