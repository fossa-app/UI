import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSetupData, selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';

const SetupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: step, status } = useAppSelector(selectStep);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSetupData());
    }
  }, [status]);

  React.useEffect(() => {
    if (step === SetupStep.COMPANY) {
      navigate(ROUTES.setCompany.path);
    } else if (step === SetupStep.BRANCH) {
      navigate(ROUTES.setBranches.path);
    } else if (step === SetupStep.EMPLOYEE) {
      navigate(ROUTES.setEmployee.path);
    } else if (step === SetupStep.COMPLETED) {
      navigate(ROUTES.manage.path);
    }
  }, [step]);

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <Box sx={{ width: { md: 544, xs: '100%' }, margin: '0 auto' }}>
      <Outlet />
    </Box>
  );
};

export default SetupPage;
