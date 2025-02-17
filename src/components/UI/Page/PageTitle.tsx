import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePageContext } from './PageContext';

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
  const context = usePageContext();

  if (!context) {
    throw new Error('PageTitle must be used within a Page component using PageContext.');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} {...props}>
      {withBackButton && (
        // TODO: make the page-title-back-button module based
        <IconButton aria-label="Navigate Back" data-cy="page-title-back-button" size="large" onClick={onBackButtonClick}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
        {children}
      </Typography>
    </Box>
  );
};
