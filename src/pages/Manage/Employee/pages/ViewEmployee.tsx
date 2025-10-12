import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { selectEmployee, resetEmployee, selectProfile, selectUserRoles } from 'store/features';
import { fetchEmployeeById } from 'store/thunks';
import { UserRole } from 'shared/types';
import { EMPLOYEE_VIEW_DETAILS_SCHEMA, ROUTES, ACTION_BUTTON_STYLES } from 'shared/constants';
import { areEqualBigIds } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import WithRolesLayout from 'components/layouts/WithRolesLayout';
import ViewDetails from 'components/UI/ViewDetails';

const testModule = EMPLOYEE_VIEW_DETAILS_SCHEMA.module;
const testSubModule = EMPLOYEE_VIEW_DETAILS_SCHEMA.subModule;

const ViewEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { item: employee, fetchStatus } = useAppSelector(selectEmployee);
  const { item: profile } = useAppSelector(selectProfile);
  const userRoles = useAppSelector(selectUserRoles);
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const handleEditClick = () => {
    const editPath = generatePath(ROUTES.editEmployee.path, { id });

    navigate(editPath);
  };

  const handleProfileClick = () => {
    navigate(ROUTES.viewProfile.path);
  };

  React.useEffect(() => {
    if (id && (!employee || !areEqualBigIds(employee.id, id))) {
      dispatch(fetchEmployeeById({ id, shouldFetchBranchGeoAddress: false }));
    }
  }, [id, employee, dispatch]);

  React.useEffect(() => {
    if (!id) {
      dispatch(resetEmployee());
    }
  }, [id, dispatch]);

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle="View Employee"
      fallbackRoute={ROUTES.employees.path}
      displayNotFoundPage={fetchStatus === 'failed' && !employee}
    >
      <ViewDetails module={testModule} subModule={testSubModule} loading={loading}>
        <ViewDetails.Header>{EMPLOYEE_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
        <ViewDetails.Content fields={EMPLOYEE_VIEW_DETAILS_SCHEMA.fields} values={employee} />
        <ViewDetails.Actions sx={{ flexWrap: 'wrap', gap: 4 }}>
          {profile?.id === employee?.id && (
            <Button
              data-cy={`${testModule}-${testSubModule}-view-profile-button`}
              aria-label="View Profile Button"
              variant="outlined"
              color="secondary"
              sx={ACTION_BUTTON_STYLES}
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
              sx={ACTION_BUTTON_STYLES}
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
