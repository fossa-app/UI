import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Page, { PageTitle } from 'components/UI/Page';

interface TableLayoutProps {
  pageTitle: string;
  withActionButton?: boolean;
  actionButtonLabel?: string;
  onActionClick?: () => void;
}

const TableLayout: React.FC<React.PropsWithChildren<TableLayoutProps>> = ({
  pageTitle,
  withActionButton = false,
  actionButtonLabel = 'New Item',
  onActionClick,
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
      <Page sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left', mb: 5 }}>
        <PageTitle sx={{ flexGrow: 1 }}>{pageTitle}</PageTitle>
        {withActionButton && (
          <Button variant="contained" color="primary" onClick={onActionClick}>
            {actionButtonLabel}
          </Button>
        )}
      </Page>
      {children}
    </Box>
  );
};

export default TableLayout;
