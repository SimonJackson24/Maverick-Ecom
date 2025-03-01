import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error',
  message,
  onRetry
}) => {
  return (
    <Alert 
      severity="error"
      sx={{
        my: 2,
        width: '100%'
      }}
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;
