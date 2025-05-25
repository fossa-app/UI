import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppSelector } from 'store';
import { selectCompanyOffboardingStep } from 'store/features';
import { OffboardingStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

const CompanyOffboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: step } = useAppSelector(selectCompanyOffboardingStep);

  React.useEffect(() => {
    if (step === OffboardingStep.company && pathname !== ROUTES.deleteCompany.path) {
      navigate(ROUTES.deleteCompany.path, { replace: true });
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

export default CompanyOffboardingPage;
