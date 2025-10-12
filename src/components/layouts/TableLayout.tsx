import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Module, SubModule, UserRole } from 'shared/types';
import { ACTION_BUTTON_STYLES } from 'shared/constants';
import Page from 'components/UI/Page';
import WithRolesLayout from './WithRolesLayout';

type TableLayoutProps = {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  userRoles?: UserRole[];
  allowedActionRoles?: UserRole[];
  actionButtonLabel?: string;
  onActionClick?: () => void;
} & BoxProps;

const TableLayout: React.FC<React.PropsWithChildren<TableLayoutProps>> = ({
  module,
  subModule,
  pageTitle,
  userRoles,
  allowedActionRoles,
  actionButtonLabel,
  onActionClick,
  children,
  ...props
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, ...props.sx }} {...props}>
      <Page
        module={module}
        subModule={subModule}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 5, minHeight: 38, gap: 4 }}
      >
        <Page.Title sx={{ flexGrow: 1 }} typographyProps={{ sx: { textAlign: 'left' } }}>
          {pageTitle}
        </Page.Title>
        <WithRolesLayout allowedRoles={allowedActionRoles} userRoles={userRoles}>
          {actionButtonLabel && (
            <Button
              data-cy={`${module}-${subModule}-table-layout-action-button`}
              aria-label="New Item"
              variant="contained"
              color="primary"
              sx={ACTION_BUTTON_STYLES}
              onClick={onActionClick}
            >
              {actionButtonLabel}
            </Button>
          )}
        </WithRolesLayout>
      </Page>
      {children}
    </Box>
  );
};

export default TableLayout;
