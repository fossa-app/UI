import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { uploadCompanyLicense } from 'store/thunks';
import {
  selectCompany,
  selectCompanyLicense,
  selectIsUserAdmin,
  selectUserRoles,
  setCompanyLicenseSkipped,
  resetCompanyLicenseSkipped,
} from 'store/features';
import { mapDisabledFields, hasAllowedRole, deepCopyObject } from 'shared/helpers';
import { ROUTES, UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA, USER_PERMISSION_GENERAL_ERROR } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';
import { renderCopyableField } from 'components/UI/helpers/renderCopyableField';

const testModule = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.module;
const testSubModule = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.subModule;

const UploadCompanyLicensePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { updateStatus, updateError: error } = useAppSelector(selectCompanyLicense);
  const { item: company } = useAppSelector(selectCompany);
  const skipRef = React.useRef(false);
  const errors = isUserAdmin ? deepCopyObject(error?.errors) : USER_PERMISSION_GENERAL_ERROR;

  React.useEffect(() => {
    return () => {
      if (!skipRef.current) {
        dispatch(resetCompanyLicenseSkipped());
      }
    };
  }, [dispatch]);

  const handleSkip = () => {
    skipRef.current = true;
    dispatch(setCompanyLicenseSkipped());
    navigate(ROUTES.createBranch.path, { replace: true });
  };

  const fields = mapDisabledFields(UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.fields, userRoles).map((field) => {
    switch (field.name) {
      case 'companyId':
        return {
          ...field,
          type: undefined,
          renderField: () =>
            renderCopyableField({
              module: testModule,
              subModule: testSubModule,
              label: 'Company ID',
              text: String(company?.id),
            }),
        };
      case 'licenseFile':
        return {
          ...field,
          disabled: !hasAllowedRole(field.roles, userRoles),
        };
      default:
        return field;
    }
  });

  const actions = UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.actions.map((action) => {
    switch (action.name) {
      case FormActionName.submit:
        return {
          ...action,
          disabled: !hasAllowedRole(action.roles, userRoles),
          loading: updateStatus === 'loading',
        };
      case FormActionName.cancel:
        return { ...action, disabled: !hasAllowedRole(action.roles, userRoles), onClick: handleSkip };
      default:
        return action;
    }
  });

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
