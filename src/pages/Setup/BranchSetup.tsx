import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, selectBranch, selectIsUserAdmin } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const BranchSetupPage: React.FC = () => {
  const { updateStatus, error } = useAppSelector(selectBranch);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const dispatch = useAppDispatch();

  const handleSubmit = (name: string) => {
    dispatch(createBranch({ name }));
  };

  return (
    <CompanyDetailsForm
      title="Create a Branch"
      label="Enter Branch name"
      validationMessage="Branch name is required"
      isAdmin={isUserAdmin}
      error={updateStatus === 'failed' ? error : undefined}
      loading={updateStatus === 'loading'}
      onSubmit={handleSubmit}
    />
  );
};

export default BranchSetupPage;
