import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompany, selectCompany, selectIsUserAdmin, selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';

// TODO: use navigation loader instead
const SetupPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const step = useAppSelector(selectStep);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const getCompany = async (): Promise<void> => {
    dispatch(fetchCompany());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getCompany();
    }
  }, [status]);

  React.useEffect(() => {
    if (step === SetupStep.COMPANY) {
      navigate(ROUTES.company.path);
    } else if (step === SetupStep.BRANCHES && isUserAdmin) {
      navigate(ROUTES.branches.path);
    } else if (step === SetupStep.EMPLOYEE && isUserAdmin) {
      navigate(ROUTES.employee.path);
    }
  }, [step, isUserAdmin]);

  if (status === 'loading') {
    return <LinearProgress />;
  }

  return <Outlet />;
};

export default SetupPage;
