import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme/theme';
import Layout from './components/layout/Layout';
import Routes from './Routes';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
