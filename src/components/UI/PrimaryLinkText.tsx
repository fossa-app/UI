import * as React from 'react';
import Typography from '@mui/material/Typography';

type RenderPrimaryLinkTextProps<T> = {
  item: T;
  getText: (item: T) => string;
  onClick: (item: T) => void;
};

export const renderPrimaryLinkText = <T,>({ item, getText, onClick }: RenderPrimaryLinkTextProps<T>) => (
  <Typography
    variant="body1"
    color="primary"
    sx={{
      cursor: 'pointer',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    }}
    onClick={() => onClick(item)}
  >
    {getText(item)}
  </Typography>
);
