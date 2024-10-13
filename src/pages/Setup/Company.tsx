import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const CompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const handleSubmit = (value: string) => {
    dispatch(createCompany(value));
  };

  return (
    <CompanyDetailsForm
      title="Create a Company"
      label="Enter Company name"
      validationMessage="Company name is required"
      isAdmin={isUserAdmin}
      error={error}
      loading={status === 'loading'}
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyPage;
