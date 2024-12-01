import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Page, { PageTitle, PageSubtitle } from 'components/UI/Page';

interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title = 'Page Not Found',
  subtitle = 'Oops! The page you are looking for does not exist.',
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 5 }}>
      <Page>
        <PageTitle data-cy="not-found-page-title">{title}</PageTitle>
        <PageSubtitle>{subtitle}</PageSubtitle>
      </Page>
      <Button data-cy="not-found-page-button" aria-label="Navigate Home" component={Link} to="/" variant="contained" color="primary">
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
