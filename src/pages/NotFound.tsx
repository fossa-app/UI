import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageTitle from 'components/PageTitle';

const NotFoundPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 5 }}>
      <PageTitle>Page Not Found</PageTitle>
      <Typography variant="body1">Oops! The page you are looking for does not exist.</Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
