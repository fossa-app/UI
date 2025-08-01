import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppSelector } from 'store';
import { selectCompanyOffboardingInstructionsFlags, selectIsUserAdmin } from 'store/features';
import { COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA, ROUTES, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import { CompanyOffboardingInstructionData, RouteItem } from 'shared/models';
import Form from 'components/UI/Form';

const testModule = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.module;
const testSubModule = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.subModule;

const CompanyOffboardingInstructionsPage: React.FC = () => {
  const navigate = useNavigate();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { status, branches, employees, departments } = useAppSelector(selectCompanyOffboardingInstructionsFlags);
  const loading = status === 'idle' || status === 'loading';
  const values = React.useMemo(() => ({ branches, employees, departments }), [branches, employees, departments]);

  const errors = React.useMemo(() => {
    if (!isUserAdmin) {
      return USER_PERMISSION_GENERAL_MESSAGE;
    }
  }, [isUserAdmin]);

  const handleNavigate = (path: RouteItem['path']) => {
    navigate(path);
  };

  return (
    <Form<CompanyOffboardingInstructionData> module={testModule} subModule={testSubModule} errors={errors} loading={loading}>
      <Form.Header>{COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.title}</Form.Header>

      <Form.Content fields={COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.fields} values={values} />

      <Form.Actions>
        {branches ? (
          <Button
            data-cy={`${testModule}-${testSubModule}-form-submit-button`}
            disabled={!isUserAdmin}
            aria-label="Branch Catalog Navigation Button"
            variant="contained"
            color="error"
            onClick={() => handleNavigate(ROUTES.branches.path)}
          >
            Go to Branch Catalog
          </Button>
        ) : departments ? (
          <Button
            data-cy={`${testModule}-${testSubModule}-form-submit-button`}
            disabled={!isUserAdmin}
            aria-label="Department Catalog Navigation Button"
            variant="contained"
            color="error"
            onClick={() => handleNavigate(ROUTES.departments.path)}
          >
            Go to Department Catalog
          </Button>
        ) : employees ? (
          <Button
            data-cy={`${testModule}-${testSubModule}-form-submit-button`}
            aria-label="Employee Offboarding Navigation Button"
            variant="contained"
            color="error"
            onClick={() => handleNavigate(ROUTES.deleteEmployee.path)}
          >
            Go to Employee Offboarding
          </Button>
        ) : null}
      </Form.Actions>
    </Form>
  );
};

export default CompanyOffboardingInstructionsPage;
