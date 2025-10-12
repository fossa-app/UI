import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompanyOffboardingStep } from 'store/features';
import { fetchCompanyDatasourceTotals } from 'store/thunks';
import { COMPANY_OFFBOARDING_STEPS, COMPANY_OFFBOARDING_STEP_MAP } from 'shared/constants';
import { Module, SubModule } from 'shared/types';

const CompanyOffboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { item: step } = useAppSelector(selectCompanyOffboardingStep);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    navigate(COMPANY_OFFBOARDING_STEP_MAP[step].path, { replace: true });
  }, [step, navigate]);

  React.useEffect(() => {
    const currentStep = COMPANY_OFFBOARDING_STEPS.findIndex(({ name }) => name === step);

    if (currentStep !== -1) {
      setActiveStep(currentStep);
    }
  }, [step]);

  React.useEffect(() => {
    dispatch(fetchCompanyDatasourceTotals());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 5 }}>
      <Stepper activeStep={activeStep} sx={{ justifyContent: 'center', mb: 3 }}>
        {COMPANY_OFFBOARDING_STEPS.map(({ name, label }) => (
          <Step key={label} data-cy={`${Module.offboarding}-${SubModule.companyOffboarding}-stepper-${name}`}>
            <StepLabel>
              <Typography variant="h6">{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default CompanyOffboardingPage;
