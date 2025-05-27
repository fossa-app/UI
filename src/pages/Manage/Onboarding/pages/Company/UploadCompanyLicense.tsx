import * as React from 'react';
import { FieldValues, FieldErrors } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompanyLicense, selectIsUserAdmin, selectUserRoles, uploadCompanyLicense } from 'store/features';
import { mapDisabledFields, hasAllowedRole, deepCopyObject } from 'shared/helpers';
import { UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.module;
const testSubModule = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.subModule;

const UploadCompanyLicensePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { updateStatus, updateError: error } = useAppSelector(selectCompanyLicense);

  const fields = React.useMemo(() => {
    return mapDisabledFields(UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.fields, userRoles);
  }, [userRoles]);

  const errors = React.useMemo(() => {
    if (!isUserAdmin) {
      return USER_PERMISSION_GENERAL_MESSAGE as unknown as FieldErrors<FieldValues>;
    }

    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors, isUserAdmin]);

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
    <Form<File> module={testModule} subModule={testSubModule} errors={errors} onSubmit={handleSubmit}>
      <Form.Header>{UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.title}</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default UploadCompanyLicensePage;
