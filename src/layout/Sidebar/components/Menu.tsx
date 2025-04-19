import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { ALL_FLOWS } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';
import FlowItem from 'components/Flow/FlowItem';

interface MenuProps {
  onCloseSideBar: () => void;
}

const Menu: React.FC<MenuProps> = ({ onCloseSideBar }) => {
  const theme = useTheme();
  const location = useLocation();

  const getButtonStyles = (isActive: boolean) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.info.contrastText,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <List>
        {ALL_FLOWS.map((item) => {
          const { subFlows, ...rest } = item;
          const isActive = location.pathname.includes(item.path);
          const buttonStyles = getButtonStyles(isActive);

          return (
            <FlowItem
              {...rest}
              key={item.name}
              data-cy={getTestSelectorByModule(Module.shared, SubModule.menu, `menu-item-${item.name}`)}
              onPostNavigate={onCloseSideBar}
              iconProps={{ sx: buttonStyles }}
              textProps={{ sx: buttonStyles }}
            />
          );
        })}
      </List>
    </Box>
  );
};

export default Menu;
