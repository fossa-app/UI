import * as React from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppSelector } from 'store';
import { selectBranches, selectCompany, selectStep } from 'store/features';
import { SetupStep } from 'shared/models';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const outlet = useOutlet();
  const step = useAppSelector(selectStep);
  const { data: company, status: companyStatus } = useAppSelector(selectCompany);
  const { data: branches, status: branchesStatus } = useAppSelector(selectBranches);
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
  }, [step]);

  if (isCompanyLoading || isBranchesLoading) {
    return <Loader />;
  }

  return <Box sx={{ width: { md: 544, xs: '100%' }, margin: '0 auto' }}>{outlet}</Box>;
};

export default SetupPage;
