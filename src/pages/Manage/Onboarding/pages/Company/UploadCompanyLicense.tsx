import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldValues, FieldErrors } from 'react-hook-form';
import { renderCopyableField } from 'components/UI/helpers/renderCopyableField';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany } from 'store/features/companySlice';
import { selectCompanyLicense, uploadCompanyLicense } from 'store/features/licenseSlice';
import { selectIsUserAdmin, selectUserRoles } from 'store/features/authSlice';
import { setCompanyLicenseSkipped, resetCompanyLicenseSkipped } from 'store/features/onboardingSlice';
import { mapDisabledFields, hasAllowedRole, deepCopyObject } from 'shared/helpers';
import { ROUTES, UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

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

  React.useEffect(() => {
    return () => {
      if (!skipRef.current) {
        dispatch(resetCompanyLicenseSkipped());
      }
    };
  }, [dispatch]);

  const handleSkip = React.useCallback(() => {
    skipRef.current = true;
    dispatch(setCompanyLicenseSkipped());
    navigate(ROUTES.createBranch.path, { replace: true });
  }, [dispatch, navigate]);

  const fields = React.useMemo(() => {
    const mappedFields = mapDisabledFields(UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA.fields, userRoles);

    return mappedFields.map((field) => {
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
  }, [userRoles, company?.id]);

  const errors = React.useMemo(() => {
    if (!isUserAdmin) {
      return USER_PERMISSION_GENERAL_MESSAGE;
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
        case FormActionName.cancel:
          return { ...action, disabled: !hasAllowedRole(action.roles, userRoles), onClick: handleSkip };
        default:
          return action;
      }
    });
  }, [userRoles, updateStatus, handleSkip]);

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
