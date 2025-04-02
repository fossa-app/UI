import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { editProfile, resetProfileFetchStatus, selectProfile } from 'store/features';
import { PROFILE_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { Employee } from 'shared/models';
import { deepCopyObject, mapProfileDTO } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = PROFILE_DETAILS_FORM_SCHEMA.module;
const testSubModule = PROFILE_DETAILS_FORM_SCHEMA.subModule;

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile, error, updateStatus } = useAppSelector(selectProfile);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const defaultValues: Employee = {
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    fullName: profile?.fullName ?? '',
    assignedBranchId: profile?.assignedBranchId ?? null,
  };

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const navigateToViewProfile = React.useCallback(() => {
    navigate(ROUTES.viewProfile.path);
  }, [navigate]);

  const handleCancel = React.useCallback(() => {
    setFormSubmitted(false);
    navigateToViewProfile();
  }, [navigateToViewProfile]);

  const actions = React.useMemo(
    () =>
      PROFILE_DETAILS_FORM_SCHEMA.actions.map((action) => {
        switch (action.name) {
          case FormActionName.cancel:
            return { ...action, onClick: handleCancel };
          case FormActionName.submit:
            return { ...action, loading: updateStatus === 'loading' };
          default:
            return action;
        }
      }),
    [updateStatus, handleCancel]
  );

  const handleSubmit = (formValue: Omit<Employee, 'id'>) => {
    const submitData = mapProfileDTO(formValue);

    dispatch(editProfile(submitData));
    setFormSubmitted(true);
  };

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetProfileFetchStatus());
      navigateToViewProfile();
    }
  }, [updateStatus, formSubmitted, navigateToViewProfile, dispatch]);

  return (
    <PageLayout module={testModule} subModule={testSubModule} pageTitle="Edit Profile">
      <Form<Employee> module={testModule} subModule={testSubModule} defaultValues={defaultValues} errors={errors} onSubmit={handleSubmit}>
        <Form.Header>{PROFILE_DETAILS_FORM_SCHEMA.title}</Form.Header>

        <Form.Content fields={PROFILE_DETAILS_FORM_SCHEMA.fields} />

        <Form.Actions actions={actions}></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default EditProfilePage;
