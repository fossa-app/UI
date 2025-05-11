import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectEmployeeOnboardingStep } from 'store/features';
import { OnboardingStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

const EmployeeOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: step } = useAppSelector(selectEmployeeOnboardingStep);

  React.useEffect(() => {
    // TODO: check, when the company has not been created and manually navigating to ROUTES.companyOnboarding.path, it redirects to the ROUTES.viewCompany.path
    // TODO: check, when on any setup page, after refresh it redirects to the flows page
    if (step === OnboardingStep.EMPLOYEE && pathname !== ROUTES.setupEmployee.path) {
      navigate(ROUTES.setupEmployee.path);
    } else if (step !== OnboardingStep.EMPLOYEE) {
      navigate(ROUTES.flows.path);
    }
  }, [step, pathname, navigate]);

  return <Outlet />;
};

export default EmployeeOnboarding;
