import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { usePageContext } from './PageContext';

type PageSubtitleProps = TypographyProps;

const PageSubtitle = ({ variant = 'subtitle1', children, ...props }: React.PropsWithChildren<PageSubtitleProps>) => {
  const context = usePageContext();

  if (!context) {
    throw new Error('PageSubtitle must be used within a Page component using PageContext.');
  }

  const { module, subModule } = context;

  return (
    <Typography
      data-cy={`${module}-${subModule}-page-subtitle`}
      variant={variant}
      component="p"
      color="textSecondary"
      sx={{ textAlign: 'center' }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default PageSubtitle;
