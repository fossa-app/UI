import * as React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useAppDispatch, useAppSelector } from 'store';
import { createProfile, fetchProfile, selectUser, selectProfile } from 'store/features';
import { Employee, Module, SubModule } from 'shared/models';
import { EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { mapProfileDTO, mapUserProfileToEmployee } from 'shared/helpers';
import EmployeeDetailsForm from 'components/forms/EmployeeDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const SetupEmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector(selectUser);
  const { data: profile, updateStatus } = useAppSelector(selectProfile);

  const handleSubmit = (formValue: Employee) => {
    const submitData = mapProfileDTO(formValue);

    dispatch(createProfile(submitData));
  };

  React.useEffect(() => {
    if (!profile || profile.isDraft) {
      dispatch(fetchProfile());
    }
  }, [profile, dispatch]);

  return (
    <PageLayout module={Module.employeeSetup} subModule={SubModule.employeeDetails} pageTitle="Create Employee">
      <EmployeeDetailsForm
        actionLabel="Finish"
        headerText="Employee Details"
        actionIcon={<DoneIcon />}
        module={Module.employeeSetup}
        subModule={SubModule.employeeDetails}
        actionLoading={updateStatus === 'loading'}
        fields={EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA}
        data={mapUserProfileToEmployee(user?.profile)}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default SetupEmployeePage;
