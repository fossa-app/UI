import * as React from 'react';
import Box from '@mui/system/Box';

interface ContentProps {
  children: React.ReactElement | null;
}

const Content: React.FC<ContentProps> = ({ children }: ContentProps) => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      {children}
    </Box>
  );
};

export default Content;
