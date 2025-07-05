import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppSelector } from 'store';
import { selectIsUserAdmin } from 'store/features';
import { COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA, ROUTES, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.module;
const testSubModule = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.subModule;

const CompanyOffboardingInstructionsPage: React.FC = () => {
  const navigate = useNavigate();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const fields = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.fields;

  const actions = React.useMemo(() => {
    return COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.actions.map((action) => {
      switch (action.name) {
        case FormActionName.submit:
          return {
            ...action,
            disabled: !isUserAdmin,
            loading: false,
          };
        default:
          return action;
      }
    });
  }, [isUserAdmin]);

  const errors = React.useMemo(() => {
    if (!isUserAdmin) {
      return USER_PERMISSION_GENERAL_MESSAGE as unknown as FieldErrors<FieldValues>;
    }
  }, [isUserAdmin]);

  const handleSubmit = () => {
    navigate(ROUTES.branches.path);
  };

  return (
    <Form module={testModule} subModule={testSubModule} errors={errors} onSubmit={handleSubmit}>
      <Form.Header>{COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.title}</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default CompanyOffboardingInstructionsPage;
