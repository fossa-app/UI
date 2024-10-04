import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EmployeePage: React.FC<{}> = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ my: 2 }}>
        Step 3: Create an Employee
      </Typography>
    </Box>
  );
};

export default EmployeePage;
