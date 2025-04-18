import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { FLOWS } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';
import FlowItem from 'components/UI/FlowItem';

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
        {FLOWS.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const buttonStyles = getButtonStyles(isActive);

          return (
            <FlowItem
              {...item}
              key={item.name}
              data-cy={getTestSelectorByModule(Module.shared, SubModule.menu, `menu-item-${item.name}`)}
              onPostNavigate={onCloseSideBar}
              iconSx={buttonStyles}
              textSx={buttonStyles}
            />
          );
        })}
      </List>
    </Box>
  );
};

export default Menu;
