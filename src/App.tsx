import * as React from 'react';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Typography variant="subtitle1">Fossa</Typography>
    </Box>
  );
};

export default App;
