import * as React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployeeById, selectEmployee, resetEmployee, selectProfile, selectUserRoles } from 'store/features';
import { UserRole } from 'shared/models';
import { EMPLOYEE_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import WithRolesLayout from 'components/layouts/WithRolesLayout';
import ViewDetails from 'components/UI/ViewDetails';

const testModule = EMPLOYEE_VIEW_DETAILS_SCHEMA.module;
const testSubModule = EMPLOYEE_VIEW_DETAILS_SCHEMA.subModule;

const ViewEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: employee, fetchStatus } = useAppSelector(selectEmployee);
  const { data: profile } = useAppSelector(selectProfile);
  const userRoles = useAppSelector(selectUserRoles);
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const handleEditClick = () => {
    const editPath = generatePath(ROUTES.editEmployee.path, { id });

    navigate(editPath);
  };

  const handleProfileClick = () => {
    navigate(ROUTES.viewProfile.path);
  };

  const navigateBack = () => {
    navigate(ROUTES.employees.path);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById({ id }));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(resetEmployee());
    };
  }, [dispatch]);

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle="View Employee"
      displayNotFoundPage={fetchStatus === 'failed' && !employee}
      onBackButtonClick={navigateBack}
    >
      <ViewDetails module={testModule} subModule={testSubModule} loading={loading}>
        <ViewDetails.Header>{EMPLOYEE_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
        <ViewDetails.Content fields={EMPLOYEE_VIEW_DETAILS_SCHEMA.fields} values={employee} />
        <ViewDetails.Actions>
          {profile?.id === employee?.id && (
            <Button
              data-cy={`${testModule}-${testSubModule}-view-profile-button`}
              aria-label="View Profile Button"
              variant="outlined"
              color="secondary"
              onClick={handleProfileClick}
            >
              Profile
            </Button>
          )}
          <WithRolesLayout allowedRoles={[UserRole.administrator]} userRoles={userRoles}>
            <Button
              data-cy={`${testModule}-${testSubModule}-view-action-button`}
              aria-label="Edit Employee Button"
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </WithRolesLayout>
        </ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewEmployeePage;
