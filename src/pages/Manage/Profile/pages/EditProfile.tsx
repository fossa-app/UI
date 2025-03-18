import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { editProfile, resetProfileFetchStatus, selectProfile } from 'store/features';
import { PROFILE_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { Employee, Module, SubModule } from 'shared/models';
import { deepCopyObject, mapProfileDTO } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import EmployeeDetailsForm from 'components/forms/EmployeeDetailsForm';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile, error, updateStatus } = useAppSelector(selectProfile);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const navigateToViewProfile = React.useCallback(() => {
    navigate(ROUTES.viewProfile.path);
  }, [navigate]);

  const handleSubmit = (formValue: Omit<Employee, 'id'>) => {
    const submitData = mapProfileDTO(formValue);

    dispatch(editProfile(submitData));
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    setFormSubmitted(false);
    navigateToViewProfile();
  };

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetProfileFetchStatus());
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
        data={profile}
        errors={errors}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditProfilePage;
