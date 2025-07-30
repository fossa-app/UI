import * as React from 'react';
import Typography from '@mui/material/Typography';

type RenderPrimaryLinkTextParams<T> = {
  item: T;
  getText: (item: T) => string;
  onClick: (item: T) => void;
};

export const renderPrimaryLinkText = <T,>({ item, getText, onClick }: RenderPrimaryLinkTextParams<T>) => (
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
