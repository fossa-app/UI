import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { usePageContext } from './PageContext';

type PageSubtitleProps = TypographyProps;

export const PageSubtitle: React.FC<React.PropsWithChildren<PageSubtitleProps>> = ({ children, ...props }) => {
  const context = usePageContext();

  if (!context) {
    throw new Error('PageSubtitle must be used within a Page component using PageContext.');
  }

  return (
    <Typography variant="subtitle1" component="h2" color="textSecondary" {...props}>
      {children}
    </Typography>
  );
};
