import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Module, SubModule } from 'shared/models';
import Page from './UI/Page';

interface State {
  hasError: boolean;
  error?: Error;
}

const testModule = Module.shared;
const testSubModule = SubModule.error;

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 5 }}>
          <Page module={testModule} subModule={testSubModule}>
            <Page.Title>Something went wrong</Page.Title>
            <Page.Subtitle
              sx={{
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {this.state.error?.message}
            </Page.Subtitle>
          </Page>
          <Button
            data-cy={`${testModule}-${testSubModule}-reload-button`}
            aria-label="Reload"
            variant="contained"
            color="primary"
            onClick={this.reset}
          >
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
