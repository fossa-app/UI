import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Item, Module, SubModule, UserRole } from 'shared/models';
import { Action } from 'components/UI/Table';
import WithRolesLayout from 'components/layouts/WithRolesLayout';

interface ActionsMenuProps<T> {
  module: Module;
  subModule: SubModule;
  actions: Action<T>[];
  context: T;
  userRoles?: UserRole[];
}

const ActionsMenu = <T extends Item>({ module, subModule, actions, context, userRoles }: ActionsMenuProps<T>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenActionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActionsMenu = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: Action<T>) => {
    if (action.onClick) {
      action.onClick(context);
    }

    handleCloseActionsMenu();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        data-cy={`${module}-${subModule}-actions-menu-icon-${context.id}`}
        aria-label="Actions Menu"
        size="small"
        color="default"
        sx={{ p: { xs: 0, sm: 1 } }}
        onClick={handleOpenActionsMenu}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        keepMounted
        data-cy={`${module}-${subModule}-actions-menu-${context.id}`}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleCloseActionsMenu}
      >
        {actions.map((action) => (
          <WithRolesLayout key={action.field} allowedRoles={action.roles} userRoles={userRoles}>
            <MenuItem
              data-cy={`${module}-${subModule}-action-${action.field}-${context.id}`}
              sx={{ minHeight: 'auto' }}
              onClick={() => handleActionClick(action)}
            >
              <Typography variant="body2">{action.name}</Typography>
            </MenuItem>
          </WithRolesLayout>
        ))}
      </Menu>
    </Box>
  );
};

export default ActionsMenu;
