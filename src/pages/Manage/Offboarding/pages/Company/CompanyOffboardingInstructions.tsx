import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { useAppSelector } from 'store';
import { selectCompanyOffboardingInstructionsFlags, selectIsUserAdmin } from 'store/features';
import { COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA, ROUTES, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import Form from 'components/UI/Form';

const testModule = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.module;
const testSubModule = COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.subModule;

const CompanyOffboardingInstructionsPage: React.FC = () => {
  const navigate = useNavigate();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { status, branches, employees, departments } = useAppSelector(selectCompanyOffboardingInstructionsFlags);
  const loading = React.useMemo(() => {
    return status === 'idle' || status === 'loading';
  }, [status]);

  const errors = React.useMemo(() => {
    if (!isUserAdmin) {
      return USER_PERMISSION_GENERAL_MESSAGE as unknown as FieldErrors<FieldValues>;
    }
  }, [isUserAdmin]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Form module={testModule} subModule={testSubModule} errors={errors} loading={loading}>
      <Form.Header>{COMPANY_OFFBOARDING_INSTRUCTIONS_FORM_SCHEMA.title}</Form.Header>

      {!loading && (
        <Form.Content>
          <Typography data-cy={`${testModule}-${testSubModule}-form-section-field-basicInfo`} variant="subtitle1">
            Please ensure all branches and departments are deleted, and all employees are offboarded before proceeding to delete the
            company.
          </Typography>
          <Grid container spacing={4}>
            <Grid size={12}>
              <Typography
                data-cy={`${testModule}-${testSubModule}-form-field-value-branches`}
                variant="subtitle1"
                color={branches ? 'error' : 'success'}
              >
                {branches ? `Remaining Branches: ${branches}` : 'All branches have been removed!'}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography
                data-cy={`${testModule}-${testSubModule}-form-field-value-departments`}
                variant="subtitle1"
                color={departments ? 'error' : 'success'}
              >
                {departments ? `Remaining Departments: ${departments}` : 'All departments have been removed!'}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography
                data-cy={`${testModule}-${testSubModule}-form-field-value-employees`}
                variant="subtitle1"
                color={employees ? 'error' : 'success'}
              >
                {employees ? `Active Employees: ${employees}` : 'All employees have been offboarded!'}
              </Typography>
            </Grid>
          </Grid>
        </Form.Content>
      )}

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
