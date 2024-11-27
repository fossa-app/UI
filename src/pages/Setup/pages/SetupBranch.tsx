import * as React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, fetchCompanyLicense, selectBranch, selectCompanyLicense, selectIsUserAdmin, selectUserRoles } from 'store/features';
import { Branch, Module, SubModule } from 'shared/models';
import { BRANCH_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { mapDisabledFields } from 'shared/helpers';
import FormLayout from 'pages/Manage/components/FormLayout';
import BrachDetailsForm from 'components/forms/BrachDetailsForm';

const SetupBranchPage: React.FC = () => {
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { updateStatus } = useAppSelector(selectBranch);
  const { status: companyLicenseStatus } = useAppSelector(selectCompanyLicense);
  const dispatch = useAppDispatch();

  const handleSubmit = (data: Branch) => {
    dispatch(createBranch([data]));
  };

  React.useEffect(() => {
    if (companyLicenseStatus === 'idle') {
      dispatch(fetchCompanyLicense());
    }
  }, [companyLicenseStatus]);

  return (
    <FormLayout module={Module.branchSetup} subModule={SubModule.branchDetails} pageTitle={'Create Branch'}>
      <BrachDetailsForm
        // formLoading={fetchStatus === 'loading'}
        module={Module.branchSetup}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        buttonLabel="Next"
        buttonIcon={<NavigateNextIcon />}
        buttonLoading={updateStatus === 'loading'}
        fields={mapDisabledFields(BRANCH_SETUP_DETAILS_FORM_SCHEMA, userRoles)}
        onSubmit={handleSubmit}
      />
    </FormLayout>
    // <CompanyDetailsForm
    //   title="Create a Branch"
    //   label="Enter Branch name"
    //   validationMessage="Branch name is required"
    //   isAdmin={isUserAdmin}
    //   loading={updateStatus === 'loading'}
    //   onSubmit={handleSubmit}
    // />
  );
};

export default SetupBranchPage;
