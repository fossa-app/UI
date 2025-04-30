import * as React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchDepartmentById, resetDepartment, selectDepartment, selectUserRoles } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { DEPARTMENT_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import { hasAllowedRole } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName } from 'components/UI/ViewDetails';

const testModule = Module.departmentManagement;
const testSubModule = SubModule.departmentViewDetails;

const ViewDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: department, fetchStatus } = useAppSelector(selectDepartment);
  const userRoles = useAppSelector(selectUserRoles);
  const { id } = useParams();
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const handleEdit = React.useCallback(() => {
    const editPath = generatePath(ROUTES.editDepartment.path, { id });

    navigate(editPath);
  }, [id, navigate]);

  const actions = React.useMemo(
    () =>
      DEPARTMENT_VIEW_DETAILS_SCHEMA.actions
        ?.filter(({ roles }) => hasAllowedRole(roles, userRoles))
        .map((action) => {
          switch (action.name) {
            case ViewDetailActionName.edit:
              return { ...action, onClick: handleEdit };
            default:
              return action;
          }
        }),
    [userRoles, handleEdit]
  );

  const navigateBack = () => {
    navigate(ROUTES.departments.path);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchDepartmentById({ id, skipState: false }));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      // TODO: this causes unnecessary fetch
      dispatch(resetDepartment());
    };
  }, [dispatch]);

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle="View Department"
      displayNotFoundPage={fetchStatus === 'failed' && !department}
      onBackButtonClick={navigateBack}
    >
      <ViewDetails module={testModule} subModule={testSubModule} loading={loading}>
        <ViewDetails.Header>{DEPARTMENT_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
        <ViewDetails.Content fields={DEPARTMENT_VIEW_DETAILS_SCHEMA.fields} values={department} />
        <ViewDetails.Actions actions={actions!}></ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewDepartmentPage;
