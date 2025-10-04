import React from 'react';
import { ROUTES, DEPARTMENT_VIEW_DETAILS_SCHEMA } from 'shared/constants';
import { selectDepartment, resetDepartment } from 'store/features';
import { fetchDepartmentById } from 'store/thunks';
import { Department, Module, SubModule } from 'shared/models';
import ViewEntity from 'components/Entity/ViewEntity';

const ViewDepartmentPage: React.FC = () => (
  <ViewEntity<Department>
    module={Module.departmentManagement}
    subModule={SubModule.departmentViewDetails}
    pageTitle="View Department"
    fallbackRoute={ROUTES.departments.path}
    selectEntity={selectDepartment}
    resetEntity={resetDepartment}
    fetchEntityAction={({ id }) => fetchDepartmentById({ id, skipState: false })}
    viewSchema={DEPARTMENT_VIEW_DETAILS_SCHEMA}
    editRoute={ROUTES.editDepartment.path}
  />
);

export default ViewDepartmentPage;
