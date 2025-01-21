import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { editEmployee, resetEmployeeFetchStatus, selectEmployee } from 'store/features';
import { PROFILE_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { EmployeeDTO, Module, SubModule } from 'shared/models';
import PageLayout from 'components/layouts/PageLayout';
import EmployeeDetailsForm from 'components/forms/EmployeeDetailsForm';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: employee, updateStatus } = useAppSelector(selectEmployee);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateToViewProfile = React.useCallback(() => {
    navigate(ROUTES.viewProfile.path);
  }, [navigate]);

  const handleSubmit = (data: Omit<EmployeeDTO, 'id'>) => {
    dispatch(editEmployee(data));
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    setFormSubmitted(false);
    navigateToViewProfile();
  };

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetEmployeeFetchStatus());
      navigateToViewProfile();
    }
  }, [updateStatus, formSubmitted, navigateToViewProfile, dispatch]);

  return (
    <PageLayout module={Module.profile} subModule={SubModule.profileDetails} pageTitle="Edit Profile">
      <EmployeeDetailsForm
        withCancel
        module={Module.profile}
        subModule={SubModule.profileDetails}
        actionLoading={updateStatus === 'loading'}
        fields={PROFILE_DETAILS_FORM_SCHEMA}
        data={employee}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditProfilePage;
