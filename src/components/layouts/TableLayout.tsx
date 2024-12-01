import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Module, SubModule } from 'shared/models';
import Page, { PageTitle } from 'components/UI/Page';

interface TableLayoutProps {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  withActionButton?: boolean;
  actionButtonLabel?: string;
  onActionClick?: () => void;
}

const TableLayout: React.FC<React.PropsWithChildren<TableLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  withActionButton = false,
  actionButtonLabel = 'New Item',
  onActionClick,
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
      <Page sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left', mb: 5 }}>
        <PageTitle data-cy={`${module}-${subModule}-table-layout-title`} sx={{ flexGrow: 1 }}>
          {pageTitle}
        </PageTitle>
        {withActionButton && (
          <Button
            data-cy={`${module}-${subModule}-table-layout-action-button`}
            aria-label="New Item"
            variant="contained"
            color="primary"
            onClick={onActionClick}
          >
            {actionButtonLabel}
          </Button>
        )}
      </Page>
      {children}
    </Box>
  );
};

export default TableLayout;
