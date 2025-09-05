import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePageContext } from './PageContext';

type PageTitleProps = {
  withBackButton?: boolean;
  typographyProps?: TypographyProps;
  onBackButtonClick?: () => void;
} & BoxProps;

const PageTitle = ({
  children,
  withBackButton = false,
  typographyProps,
  onBackButtonClick,
  ...props
}: React.PropsWithChildren<PageTitleProps>) => {
  const context = usePageContext();

  if (!context) {
    throw new Error('PageTitle must be used within a Page component using PageContext.');
  }

  const { module, subModule } = context;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', ...props?.sx }} {...props}>
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
        variant={typographyProps?.variant ?? 'h5'}
        component="h5"
        sx={{ textAlign: 'center', flexGrow: 1, ...typographyProps?.sx }}
        {...typographyProps}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default PageTitle;
