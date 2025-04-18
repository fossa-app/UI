import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { SxProps } from '@mui/material';
import { RouteItem } from 'shared/models';

type FlowItemProps = {
  itemSx?: SxProps;
  iconSx?: SxProps;
  textSx?: SxProps;
  onPostNavigate?: (path: RouteItem['path']) => void;
} & RouteItem &
  ListItemProps;

const FlowItem: React.FC<FlowItemProps> = ({ name, icon, path, itemSx, iconSx, textSx, onPostNavigate, ...props }) => (
  <ListItem {...props} disablePadding key={name}>
    <ListItemButton aria-label={name} component={Link} to={path} sx={itemSx} onClick={() => onPostNavigate?.(path)}>
      <ListItemIcon sx={iconSx}>{icon && React.createElement(icon)}</ListItemIcon>
      <ListItemText primary={name} sx={textSx} />
    </ListItemButton>
  </ListItem>
);

export default FlowItem;
