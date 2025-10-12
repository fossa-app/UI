import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import {
  resetCompanyLicenseSkipped,
  selectCompanyOnboardingFlags,
  selectCompanyOnboardingSkippedSteps,
  selectCompanyOnboardingStep,
} from 'store/features';
import { Module, OnboardingStep, SubModule } from 'shared/types';
import { COMPANY_ONBOARDING_STEP_MAP, COMPANY_ONBOARDING_STEPS } from 'shared/constants';

const CompanyOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { item: step, skippedSteps } = useAppSelector(selectCompanyOnboardingStep);
  const { companyLicense } = useAppSelector(selectCompanyOnboardingSkippedSteps);
  const { branch } = useAppSelector(selectCompanyOnboardingFlags);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    navigate(COMPANY_ONBOARDING_STEP_MAP[step].path, { replace: true });
  }, [step, navigate]);

  React.useEffect(() => {
    if (branch && companyLicense && step === OnboardingStep.companyLicense) {
      dispatch(resetCompanyLicenseSkipped());
      navigate(COMPANY_ONBOARDING_STEP_MAP[OnboardingStep.completed].path, { replace: true });
    }
  }, [step, companyLicense, branch, navigate, dispatch]);

  React.useEffect(() => {
    if (skippedSteps[OnboardingStep.companyLicense]) {
      const branchStepIdx = COMPANY_ONBOARDING_STEPS.findIndex(({ name }) => name === OnboardingStep.branch);

      if (branchStepIdx !== -1) {
        setActiveStep(branchStepIdx);
      }
    } else {
      const currentStep = COMPANY_ONBOARDING_STEPS.findIndex(({ name }) => name === step);

      if (currentStep !== -1) {
        setActiveStep(currentStep);
      }
    }
  }, [step, skippedSteps]);

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
