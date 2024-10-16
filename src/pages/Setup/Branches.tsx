import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, selectBranches, selectIsUserAdmin } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const BranchesPage: React.FC = () => {
  const { updateStatus, error } = useAppSelector(selectBranches);
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
      error={error}
      loading={updateStatus === 'loading'}
      onSubmit={handleSubmit}
    />
  );
};

export default BranchesPage;
