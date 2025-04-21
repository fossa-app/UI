import * as React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import { ListItemButtonProps } from '@mui/material/ListItemButton';
import { ListItemIconProps } from '@mui/material/ListItemIcon';
import { ListItemTextProps } from '@mui/material/ListItemText';
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
  const hasSubFlow = subFlows.length > 0;

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handlePostNavigate = () => {
    onPostNavigate?.(path);
  };

  return (
    <Paper elevation={3}>
      <FlowItem
        data-cy={`${module}-${subModule}-flow-group-${name}`}
        name={name}
        icon={icon}
        path={path}
        component={hasSubFlow ? 'div' : Link}
        buttonProps={{
          ...buttonProps,
          sx: {
            ...buttonProps?.sx,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
          onClick: hasSubFlow ? handleToggle : handlePostNavigate,
        }}
        iconProps={{
          ...iconProps,
          sx: { ...iconProps?.sx, color, justifyContent: 'center', fontSize: '2.25rem' },
        }}
        textProps={{
          ...textProps,
          sx: { ...textProps?.sx, color },
        }}
      >
        <IconButton
          size="large"
          sx={{ p: 0, visibility: hasSubFlow ? 'visible' : 'hidden' }}
          onClick={hasSubFlow ? handleToggle : undefined}
        >
          {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
        </IconButton>
      </FlowItem>

      {hasSubFlow && (
        <Collapse unmountOnExit in={expanded} timeout="auto">
          <List sx={{ p: 0 }}>
            {subFlows.map((subFlow) => (
              <FlowItem
                key={subFlow.name}
                data-cy={`${module}-${subModule}-flow-item-${subFlow.name}`}
                {...subFlow}
                buttonProps={{ ...buttonProps, disabled: !!subFlow.disabled, sx: { display: 'flex', alignItems: 'center' } }}
                iconProps={{ ...iconProps, sx: { ...iconProps?.sx, color, minWidth: 'auto', mr: 1 } }}
                textProps={{ ...textProps, sx: { ...textProps?.sx, color, flexGrow: 1 }, slotProps: { primary: { fontSize: '0.875rem' } } }}
                onPostNavigate={onPostNavigate}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Paper>
  );
};

export default FlowGroup;
