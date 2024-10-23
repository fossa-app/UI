import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const CompanySetupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { updateStatus, error } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const handleSubmit = (name: string) => {
    dispatch(createCompany({ name }));
  };

  return (
    <CompanyDetailsForm
      title="Create a Company"
      label="Enter Company name"
      validationMessage="Company name is required"
      isAdmin={isUserAdmin}
      error={updateStatus === 'failed' ? error : undefined}
      loading={updateStatus === 'loading'}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanySetupPage;
