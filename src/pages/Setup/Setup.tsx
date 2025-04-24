import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: step } = useAppSelector(selectStep);

  React.useEffect(() => {
    // TODO: check, when the company has not been created and manually navigating to ROUTES.companyOnboarding.path, it redirects to the flows page
    if (step === SetupStep.COMPANY && pathname !== ROUTES.companyOnboarding.path) {
      navigate(ROUTES.companyOnboarding.path);
    } else if (step === SetupStep.BRANCH && pathname !== ROUTES.setBranch.path) {
      navigate(ROUTES.setBranch.path);
    } else if (step === SetupStep.EMPLOYEE && pathname !== ROUTES.employeeOnbarding.path) {
      navigate(ROUTES.employeeOnbarding.path);
    } else if (step === SetupStep.COMPLETED) {
      navigate(ROUTES.flows.path);
    }
  }, [step, pathname, navigate]);

  return <Outlet />;
};

export default SetupPage;
