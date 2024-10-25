import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

type PageTitleProps = TypographyProps;

export const PageTitle: React.FC<React.PropsWithChildren<PageTitleProps>> = ({ children, ...props }) => {
  return (
    <Typography variant="h5" component="h1" {...props}>
      {children}
    </Typography>
  );
};
