import React from 'react';
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
import { Flow, Module, SubModule, UserRole } from 'shared/models';
import { hasAllowedRole } from 'shared/helpers';
import FlowItem from './FlowItem';

interface FlowGroupProps extends Flow {
  module: Module;
  subModule: SubModule;
  buttonProps?: ListItemButtonProps;
  iconProps?: ListItemIconProps;
  textProps?: ListItemTextProps;
  roles?: UserRole[];
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
  roles,
  onPostNavigate,
}) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;
  const [expanded, setExpanded] = React.useState(true);
  const hasSubFlow = subFlows.length > 0;

  // TODO: MUI element does not set disabled attribute
  const isSubFlowDisabled = (subFlow: Flow) => {
    const disabled = !!subFlow.disabled;
    const hasRoles = !!subFlow.roles?.length;
    const roleNotAllowed = hasRoles && !hasAllowedRole(subFlow.roles, roles);

    return disabled || roleNotAllowed;
  };

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
          sx: { ...iconProps?.sx, color, justifyContent: 'center', fontSize: '2rem' },
        }}
        textProps={{
          ...textProps,
          slotProps: { primary: { variant: 'h6' } },
          sx: { ...textProps?.sx, color },
        }}
      >
        <IconButton
          size="large"
          data-cy={`${module}-${subModule}-subFlows-toggle-icon-${name}`}
          sx={{ p: 0, visibility: hasSubFlow ? 'visible' : 'hidden' }}
          onClick={hasSubFlow ? handleToggle : undefined}
        >
          {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
        </IconButton>
      </FlowItem>

      {hasSubFlow && (
        <Collapse unmountOnExit in={expanded} timeout="auto">
          <List sx={{ p: 0 }} data-cy={`${module}-${subModule}-subFlows-container-${name}`}>
            {subFlows.map((subFlow) => (
              <FlowItem
                key={subFlow.name}
                data-cy={`${module}-${subModule}-flow-item-${subFlow.name}`}
                {...subFlow}
                buttonProps={{ ...buttonProps, disabled: isSubFlowDisabled(subFlow), sx: { display: 'flex', alignItems: 'center' } }}
                iconProps={{ ...iconProps, sx: { ...iconProps?.sx, color, minWidth: 'auto', mr: 1 } }}
                textProps={{ ...textProps, sx: { ...textProps?.sx, color, flexGrow: 1 }, slotProps: { primary: { variant: 'subtitle1' } } }}
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
