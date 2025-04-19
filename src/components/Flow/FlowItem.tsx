import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemIcon, { ListItemIconProps } from '@mui/material/ListItemIcon';
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import { RouteItem } from 'shared/models';

type FlowItemProps = {
  buttonProps?: ListItemButtonProps;
  iconProps?: ListItemIconProps;
  textProps?: ListItemTextProps;
  onPostNavigate?: (path: RouteItem['path']) => void;
} & RouteItem &
  ListItemProps;

const FlowItem: React.FC<FlowItemProps> = ({ name, icon, path, buttonProps, iconProps, textProps, onPostNavigate, ...props }) => (
  <ListItem {...props} disablePadding key={name}>
    <ListItemButton
      aria-label={name}
      component={Link}
      {...buttonProps}
      sx={{ ...buttonProps?.sx }}
      to={path}
      onClick={() => onPostNavigate?.(path)}
    >
      <ListItemIcon {...iconProps} sx={{ ...iconProps?.sx }}>
        {icon && React.createElement(icon)}
      </ListItemIcon>
      <ListItemText primary={name} {...textProps} sx={{ ...textProps?.sx }} />
    </ListItemButton>
  </ListItem>
);

export default FlowItem;
