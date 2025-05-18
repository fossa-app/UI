import * as React from 'react';
import { FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompanyLicense, selectIsUserAdmin, selectUserRoles, uploadCompanyLicense } from 'store/features';
import { mapDisabledFields, hasAllowedRole } from 'shared/helpers';
import { UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA, MESSAGES } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.module;
const testSubModule = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.subModule;

const UploadCompanyLicensePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { updateStatus } = useAppSelector(selectCompanyLicense);

  const fields = React.useMemo(() => {
    return mapDisabledFields(UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.fields, userRoles);
  }, [userRoles]);

  const actions = React.useMemo(() => {
    return UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.actions.map((action) => {
      switch (action.name) {
        case FormActionName.submit:
          return {
            ...action,
            disabled: !hasAllowedRole(action.roles, userRoles),
            loading: updateStatus === 'loading',
          };
        default:
          return action;
      }
    });
  }, [userRoles, updateStatus]);

  const handleSubmit = (data: FieldValues) => {
    const file = data['licenseFile'] as File;

    dispatch(uploadCompanyLicense(file));
  };

  return (
    <Form<File> module={testModule} subModule={testSubModule} onSubmit={handleSubmit}>
      <Form.Header>{UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.title}</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions actions={actions} generalValidationMessage={isUserAdmin ? undefined : MESSAGES.error.general.permission}></Form.Actions>
    </Form>
  );
};

export default UploadCompanyLicensePage;
