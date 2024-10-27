import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type PageTitleProps = {
  withBackButton?: boolean;
  onBackButtonClick?: () => void;
} & BoxProps;

export const PageTitle: React.FC<React.PropsWithChildren<PageTitleProps>> = ({
  children,
  withBackButton = false,
  onBackButtonClick,
  ...props
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} {...props}>
      {withBackButton && (
        <IconButton size="large" onClick={onBackButtonClick}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
        {children}
      </Typography>
    </Box>
  );
};
