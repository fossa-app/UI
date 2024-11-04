import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, fetchCompanyLicense, selectBranch, selectCompanyLicense, selectIsUserAdmin } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const BranchSetupPage: React.FC = () => {
  const { updateStatus } = useAppSelector(selectBranch);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { status: companyLicenseStatus } = useAppSelector(selectCompanyLicense);
  const dispatch = useAppDispatch();

  const handleSubmit = (name: string) => {
    dispatch(createBranch([{ name }]));
  };

  React.useEffect(() => {
    if (companyLicenseStatus === 'idle') {
      dispatch(fetchCompanyLicense());
    }
  }, [companyLicenseStatus]);

  return (
    <CompanyDetailsForm
      title="Create a Branch"
      label="Enter Branch name"
      validationMessage="Branch name is required"
      isAdmin={isUserAdmin}
      loading={updateStatus === 'loading'}
      onSubmit={handleSubmit}
    />
  );
};

export default BranchSetupPage;
