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

  const { module, subModule } = context;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }} {...props}>
      {withBackButton && (
        <IconButton
          aria-label="Navigate Back"
          data-cy={`${module}-${subModule}-page-title-back-button`}
          size="large"
          onClick={onBackButtonClick}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography data-cy={`${module}-${subModule}-page-title`} variant="h5" component="h1" sx={{ flexGrow: 1 }}>
        {children}
      </Typography>
    </Box>
  );
};
