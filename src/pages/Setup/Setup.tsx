import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { useAppSelector } from 'store';
import { selectBranches, selectCompany, selectIsUserAdmin, selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';
import Box from '@mui/material/Box';

// TODO: use navigation loader instead
const SetupPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const step = useAppSelector(selectStep);
  const { data: company, status: companyStatus } = useAppSelector(selectCompany);
  const { data: branches, status: branchesStatus } = useAppSelector(selectBranches);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const isCompanyLoading = !company && companyStatus === 'loading';
  const isBranchesLoading = !branches && branchesStatus === 'loading';

  React.useEffect(() => {
    if (step === SetupStep.COMPANY) {
      navigate(ROUTES.company.path);
    } else if (step === SetupStep.BRANCHES) {
      navigate(ROUTES.branches.path);
    } else if (step === SetupStep.EMPLOYEE) {
      navigate(ROUTES.employee.path);
    }
  }, [step, isUserAdmin]);

  if (isCompanyLoading || isBranchesLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ width: { md: 544, xs: '100%' }, margin: '0 auto' }}>
      <Outlet />
    </Box>
  );
};

export default SetupPage;
