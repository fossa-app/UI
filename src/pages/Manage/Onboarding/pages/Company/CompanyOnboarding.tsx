import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppSelector } from 'store';
import { selectCompanyOnboardingStep } from 'store/features';
import { Module, OnboardingStep, SubModule } from 'shared/models';
import { COMPANY_ONBOARDING_STEPS, ROUTES } from 'shared/constants';

const CompanyOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: step } = useAppSelector(selectCompanyOnboardingStep);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    if (step === OnboardingStep.company && pathname !== ROUTES.createCompany.path) {
      navigate(ROUTES.createCompany.path, { replace: true });
    } else if (step === OnboardingStep.branch && pathname !== ROUTES.createBranch.path) {
      navigate(ROUTES.createBranch.path, { replace: true });
    } else if (step === OnboardingStep.companyLicense && pathname !== ROUTES.uploadCompanyLicense.path) {
      navigate(ROUTES.uploadCompanyLicense.path, { replace: true });
    } else if (step === OnboardingStep.completed) {
      navigate(ROUTES.flows.path, { replace: true });
    }
  }, [step, pathname, navigate]);

  React.useEffect(() => {
    const currentStep = COMPANY_ONBOARDING_STEPS.findIndex(({ name }) => name === step);

    if (currentStep !== -1) {
      setActiveStep(currentStep);
    }
  }, [step]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 5 }}>
      <Stepper activeStep={activeStep} sx={{ justifyContent: 'center' }}>
        {COMPANY_ONBOARDING_STEPS.map(({ name, label }) => (
          <Step key={label} data-cy={`${Module.onboarding}-${SubModule.companyOnboarding}-stepper-${name}`}>
            <StepLabel>
              <Typography variant="h6">{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Outlet />
    </Box>
  );
};

export default CompanyOnboardingPage;
