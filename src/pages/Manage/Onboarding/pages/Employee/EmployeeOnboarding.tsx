import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppSelector } from 'store';
import { selectEmployeeOnboardingStep } from 'store/features';
import { Module, OnboardingStep, SubModule } from 'shared/types';
import { EMPLOYEE_ONBOARDING_STEPS, ROUTES } from 'shared/constants';

const EmployeeOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { item: step } = useAppSelector(selectEmployeeOnboardingStep);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    if (step === OnboardingStep.employee && pathname !== ROUTES.createEmployee.path) {
      navigate(ROUTES.createEmployee.path, { replace: true });
    } else if (step !== OnboardingStep.employee) {
      navigate(ROUTES.flows.path, { replace: true });
    }
  }, [step, pathname, navigate]);

  React.useEffect(() => {
    const currentStep = EMPLOYEE_ONBOARDING_STEPS.findIndex(({ name }) => name === step);

    if (currentStep !== -1) {
      setActiveStep(currentStep);
    }
  }, [step]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 5 }}>
      <Stepper activeStep={activeStep} sx={{ justifyContent: 'center' }}>
        {EMPLOYEE_ONBOARDING_STEPS.map(({ name, label }) => (
          <Step key={label} data-cy={`${Module.onboarding}-${SubModule.employeeOnboarding}-stepper-${name}`}>
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

export default EmployeeOnboarding;
