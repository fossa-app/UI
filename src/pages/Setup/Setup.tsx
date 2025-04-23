import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppSelector } from 'store';
import { selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: step, status } = useAppSelector(selectStep);

  React.useEffect(() => {
    const currentPath = location.pathname;

    if (step === SetupStep.COMPANY && currentPath !== ROUTES.companyOnboarding.path) {
      navigate(ROUTES.companyOnboarding.path);
    } else if (step === SetupStep.BRANCH && currentPath !== ROUTES.setBranch.path) {
      navigate(ROUTES.setBranch.path);
    } else if (step === SetupStep.EMPLOYEE && currentPath !== ROUTES.employeeOnbarding.path) {
      navigate(ROUTES.employeeOnbarding.path);
    } else if (step === SetupStep.COMPLETED) {
      navigate(ROUTES.flows.path);
    }
  }, [step, status, navigate]);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, width: { md: 744, xs: '100%' }, margin: '0 auto' }}>
      <Outlet />
    </Box>
  );
};

export default SetupPage;
