import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { ApolloError } from '@apollo/client';

interface ErrorAlertProps {
  error: ApolloError | Error;
  title?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, title = 'Error' }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {error.message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
