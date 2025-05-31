import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Module, SubModule, UserRole } from 'shared/models';
import Page from 'components/UI/Page';
import WithRolesLayout from './WithRolesLayout';

interface TableLayoutProps {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  userRoles?: UserRole[];
  allowedRoles?: UserRole[];
  actionButtonLabel?: string;
  onActionClick?: () => void;
}

const TableLayout: React.FC<React.PropsWithChildren<TableLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  userRoles,
  allowedRoles,
  actionButtonLabel = 'New Item',
  onActionClick,
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
      <Page
        module={module}
        subModule={subModule}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 5, minHeight: 38 }}
      >
        <Page.Title sx={{ flexGrow: 1, textAlign: 'left' }}>{pageTitle}</Page.Title>
        <WithRolesLayout allowedRoles={allowedRoles} userRoles={userRoles}>
          <Button
            data-cy={`${module}-${subModule}-table-layout-action-button`}
            aria-label="New Item"
            variant="contained"
            color="primary"
            onClick={onActionClick}
          >
            {actionButtonLabel}
          </Button>
        </WithRolesLayout>
      </Page>
      {children}
    </Box>
  );
};

export default TableLayout;
