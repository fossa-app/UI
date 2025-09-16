import React from 'react';
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
  component?: React.ElementType;
  children?: React.ReactNode;
  onPostNavigate?: (path: RouteItem['path']) => void;
} & RouteItem &
  ListItemProps;

const FlowItem: React.FC<FlowItemProps> = ({
  name,
  icon,
  path,
  buttonProps,
  iconProps,
  textProps,
  component = Link,
  children,
  onPostNavigate,
  ...props
}) => {
  return (
    <ListItem {...props} disablePadding key={name}>
      <ListItemButton
        aria-label={name}
        component={component}
        to={component === Link ? path : undefined}
        onClick={component === Link ? () => onPostNavigate?.(path) : buttonProps?.onClick}
        {...buttonProps}
      >
        <ListItemIcon {...iconProps}>{icon && React.createElement(icon, { sx: iconProps?.sx })}</ListItemIcon>
        <ListItemText primary={name} {...textProps} />
        {children}
      </ListItemButton>
    </ListItem>
  );
};

export default FlowItem;
