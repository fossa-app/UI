import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

type PageSubtitleProps = TypographyProps;

export const PageSubtitle: React.FC<React.PropsWithChildren<PageSubtitleProps>> = ({ children, ...props }) => {
  return (
    <Typography variant="subtitle1" component="h2" color="textSecondary" {...props}>
      {children}
    </Typography>
  );
};
