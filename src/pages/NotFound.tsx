import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import { Module, SubModule } from 'shared/models';
import Page from 'components/UI/Page';

export interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
  showActionButton?: boolean;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title = 'Page Not Found',
  subtitle = 'Oops! The page you are looking for does not exist.',
  showActionButton = true,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 5 }}>
      <Page module={Module.shared} subModule={SubModule.notFound}>
        <Page.Title>{title}</Page.Title>
        <Page.Subtitle>{subtitle}</Page.Subtitle>
      </Page>
      {showActionButton && (
        <Button
          data-cy={`${Module.shared}-${SubModule.notFound}-navigate-home-button`}
          aria-label="Navigate Home"
          component={Link}
          to="/"
          variant="contained"
          color="primary"
        >
          Go Back to Home
        </Button>
      )}
    </Box>
  );
};

export default NotFoundPage;
