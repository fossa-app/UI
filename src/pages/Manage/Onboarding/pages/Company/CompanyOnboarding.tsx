import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectCompanyOnboardingStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

const CompanyOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: step } = useAppSelector(selectCompanyOnboardingStep);

  React.useEffect(() => {
    // TODO: check, when the company has not been created and manually navigating to ROUTES.companyOnboarding.path, it redirects to the ROUTES.viewCompany.path
    // TODO: check, when on any setup page, after refresh it redirects to the flows page
    if (step === SetupStep.COMPANY && pathname !== ROUTES.setupCompany.path) {
      navigate(ROUTES.setupCompany.path);
    } else if (step === SetupStep.BRANCH && pathname !== ROUTES.setupBranch.path) {
      navigate(ROUTES.setupBranch.path);
    } else if (step === SetupStep.COMPLETED) {
      navigate(ROUTES.flows.path);
    }
  }, [step, pathname, navigate]);

  return <Outlet />;
};

export default CompanyOnboarding;
