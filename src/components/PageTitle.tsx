import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';

type PageTitleProps = {
  subtitle?: string;
} & BoxProps;

// TODO: make this component compound
const PageTitle: React.FC<React.PropsWithChildren<PageTitleProps>> = ({ children, subtitle, ...props }) => {
  return (
    <Box
      {...props}
      sx={{
        textAlign: 'center',
        my: 4,
      }}
    >
      <Typography variant="h5" component="h1">
        {children}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" component="h2" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageTitle;
