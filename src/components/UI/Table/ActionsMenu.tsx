import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Item, Module, SubModule } from 'shared/models';
import { Action } from 'components/UI/Table';

interface ActionsMenuProps<T> {
  module: Module;
  subModule: SubModule;
  actions: Action<T>[];
  context: T;
}

const ActionsMenu = <T extends Item>({ module, subModule, actions, context }: ActionsMenuProps<T>) => {
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
          <MenuItem
            key={action.field}
            data-cy={`${module}-${subModule}-action-${action.field}-${context.id}`}
            onClick={() => handleActionClick(action)}
          >
            <Typography variant="body2">{action.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ActionsMenu;
