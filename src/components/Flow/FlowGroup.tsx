import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemIcon, { ListItemIconProps } from '@mui/material/ListItemIcon';
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Flow, Module, SubModule } from 'shared/models';
import FlowItem from './FlowItem';

interface FlowGroupProps extends Flow {
  module: Module;
  subModule: SubModule;
  buttonProps?: ListItemButtonProps;
  iconProps?: ListItemIconProps;
  textProps?: ListItemTextProps;
  onPostNavigate?: (path: Flow['path']) => void;
}

const FlowGroup: React.FC<FlowGroupProps> = ({
  module,
  subModule,
  name,
  icon,
  path,
  subFlows = [],
  buttonProps,
  iconProps,
  textProps,
  onPostNavigate,
}) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;
  const [expanded, setExpanded] = React.useState(false);
  const hasSubflows = subFlows.length > 0;

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleNavigate = () => {
    onPostNavigate?.(path);
  };

  return (
    <Box sx={{ border: 1, borderColor: color, borderRadius: 2 }}>
      {/* TODO: replace this part with FlowItem component, handle navigation */}
      <ListItemButton
        disableTouchRipple
        {...buttonProps}
        data-cy={`${module}-${subModule}-flow-group-${name}`}
        sx={{
          ...buttonProps?.sx,
          color,
          borderBottom: expanded ? 1 : 0,
          borderColor: color,
          '&:hover': {
            backgroundColor: 'unset',
          },
        }}
        onClick={hasSubflows ? handleToggle : handleNavigate}
      >
        <ListItemIcon {...iconProps} sx={{ ...iconProps?.sx, color }}>
          {icon && React.createElement(icon, { sx: { fontSize: '2rem' } })}
        </ListItemIcon>
        <ListItemText primary={name} {...textProps} sx={{ ...textProps?.sx, color }} />
        {hasSubflows && (
          <IconButton size="small" sx={{ p: 0 }} onClick={handleToggle}>
            {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
          </IconButton>
        )}
      </ListItemButton>

      {hasSubflows && (
        <Collapse unmountOnExit in={expanded} timeout="auto">
          <List sx={{ p: 0 }}>
            {subFlows.map((subFlow) => (
              <FlowItem
                key={subFlow.name}
                data-cy={`${module}-${subModule}-flow-item-${subFlow.name}`}
                {...subFlow}
                buttonProps={buttonProps}
                iconProps={{ ...iconProps, sx: { ...iconProps?.sx, color } }}
                textProps={{ ...textProps, sx: { ...textProps?.sx, color }, slotProps: { primary: { fontSize: '0.875rem' } } }}
                onPostNavigate={onPostNavigate}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default FlowGroup;
