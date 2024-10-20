import * as React from 'react';
import Box from '@mui/system/Box';

const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>{children}</Box>;
};

export default Content;
