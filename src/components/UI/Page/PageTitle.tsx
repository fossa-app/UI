import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePageContext } from './PageContext';

type PageTitleProps = {
  withBackButton?: boolean;
  onBackButtonClick?: () => void;
} & BoxProps;

const PageTitle = ({ children, withBackButton = false, onBackButtonClick, ...props }: React.PropsWithChildren<PageTitleProps>) => {
  const context = usePageContext();

  if (!context) {
    throw new Error('PageTitle must be used within a Page component using PageContext.');
  }

  const { module, subModule } = context;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', ...props.sx }} {...props}>
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
      <Typography
        data-cy={`${module}-${subModule}-page-title`}
        variant="h5"
        component="h1"
        sx={{ textAlign: 'center', flexGrow: 1, ...props.sx }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default PageTitle;
