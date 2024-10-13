import * as React from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSetupData, selectStep, selectSetupStatus } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';

const SetupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const step = useAppSelector(selectStep);
  const status = useAppSelector(selectSetupStatus);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSetupData());
    }
  }, [status]);

  React.useEffect(() => {
    if (step === SetupStep.COMPANY) {
      navigate(ROUTES.company.path);
    } else if (step === SetupStep.BRANCHES) {
      navigate(ROUTES.branches.path);
    } else if (step === SetupStep.EMPLOYEE) {
      navigate(ROUTES.employee.path);
    } else if (step === SetupStep.COMPLETED) {
      navigate(ROUTES.dashboard.path);
    }
  }, [step]);

  if (status === 'loading') {
    return <Loader />;
  }

  return <Box sx={{ width: { md: 544, xs: '100%' }, margin: '0 auto' }}>{outlet}</Box>;
};

export default SetupPage;
