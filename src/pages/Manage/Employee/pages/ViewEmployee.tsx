import * as React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployeeById, selectOtherEmployee, selectIsUserAdmin, resetOtherEmployee } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { EMPLOYEE_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';

const ViewEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: employee, fetchStatus } = useAppSelector(selectOtherEmployee);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const handleEditClick = () => {
    const editPath = generatePath(ROUTES.editEmployee.path, { id });

    navigate(editPath);
  };

  const navigateBack = () => {
    navigate(ROUTES.employees.path);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(resetOtherEmployee());
    };
  }, [dispatch]);

  return (
    <PageLayout
      withBackButton
      module={Module.employeeManagement}
      subModule={SubModule.employeeViewDetails}
      pageTitle="View Employee"
      displayNotFoundPage={fetchStatus === 'failed' && !employee}
      onBackButtonClick={navigateBack}
    >
      <ViewDetails module={Module.employeeManagement} subModule={SubModule.employeeViewDetails} loading={fetchStatus === 'loading'}>
        <ViewDetails.Header>Employee Details</ViewDetails.Header>
        <ViewDetails.Content fields={EMPLOYEE_VIEW_DETAILS_SCHEMA} values={employee} />
        <ViewDetails.Actions>
          {isUserAdmin && (
            <Button
              data-cy={`${Module.employeeManagement}-${SubModule.employeeViewDetails}-view-action-button`}
              aria-label="Edit Employee Button"
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewEmployeePage;
