import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppSelector } from 'store';
import { selectEmployeeOffboardingStep } from 'store/features';
import { OffboardingStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

const EmployeeOffboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { item: step } = useAppSelector(selectEmployeeOffboardingStep);

  React.useEffect(() => {
    if (step === OffboardingStep.employee && pathname !== ROUTES.deleteEmployee.path) {
      navigate(ROUTES.deleteEmployee.path, { replace: true });
    } else if (step === OffboardingStep.completed) {
      navigate(ROUTES.flows.path, { replace: true });
    }
  }, [step, pathname, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 5 }}>
      <Outlet />
    </Box>
  );
};

export default EmployeeOffboardingPage;
