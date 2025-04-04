import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSetupData, selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';
import CircularLoader from 'components/UI/CircularLoader';

const SetupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: step, status } = useAppSelector(selectStep);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSetupData());
    }
  }, [status, dispatch]);

  React.useEffect(() => {
    if (step === SetupStep.COMPANY) {
      navigate(ROUTES.setCompany.path);
    } else if (step === SetupStep.BRANCH) {
      navigate(ROUTES.setBranch.path);
    } else if (step === SetupStep.EMPLOYEE) {
      navigate(ROUTES.setEmployee.path);
    } else if (step === SetupStep.COMPLETED && status !== 'failed') {
      navigate(ROUTES.manage.path);
    }
  }, [step, status, navigate]);

  if (status === 'loading') {
    return <CircularLoader />;
  }

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, width: { md: 744, xs: '100%' }, margin: '0 auto' }}>
      <Outlet />
    </Box>
  );
};

export default SetupPage;
