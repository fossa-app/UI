import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin, fetchCompany } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const CompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const notFound = status === 'failed' && error?.status === 404;

  const handleSubmit = (value: string) => {
    dispatch(createCompany(value));
  };

  const getCompany = async () => {
    dispatch(fetchCompany());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getCompany();
    }
  }, [status]);

  return (
    <CompanyDetailsForm
      isAdmin={isUserAdmin}
      notFound={notFound}
      title="Create a Company"
      label="Enter Company name"
      validationMessage="Company name is required"
      notFoundMessage="No Company found"
      onSubmit={handleSubmit}
    />
  );
};

export default CompanyPage;
