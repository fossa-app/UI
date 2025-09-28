import React from 'react';
import {
  selectDepartmentCatalog,
  selectDepartment,
  updateDepartmentsPagination,
  resetDepartmentsFetchStatus,
  resetDepartmentsPagination,
} from 'store/features';
import { deleteDepartment, fetchDepartments } from 'store/thunks';
import { Department, Module, SubModule } from 'shared/models';
import { DEPARTMENT_FIELDS, DEPARTMENT_TABLE_SCHEMA, DEPARTMENT_TABLE_ACTIONS_SCHEMA, ROUTES } from 'shared/constants';
import Catalog from 'components/Catalog';

const testModule = Module.departmentManagement;
const testSubModule = SubModule.departmentCatalog;

const DepartmentCatalogPage: React.FC = () => {
  return (
    <Catalog<Department>
      module={testModule}
      subModule={testSubModule}
      pageTitle="Departments"
      noRecordsLabel="No Departments Found"
      actionButtonLabel="New Department"
      newPath={ROUTES.newDepartment.path}
      viewPath={ROUTES.viewDepartment.path}
      editPath={ROUTES.editDepartment.path}
      deleteAction={deleteDepartment}
      fetchAction={fetchDepartments}
      updatePagination={updateDepartmentsPagination}
      resetFetchStatus={resetDepartmentsFetchStatus}
      resetPagination={resetDepartmentsPagination}
      selectCatalog={selectDepartmentCatalog}
      selectEntity={selectDepartment}
      tableSchema={DEPARTMENT_TABLE_SCHEMA}
      tableActionsSchema={DEPARTMENT_TABLE_ACTIONS_SCHEMA}
      primaryField={DEPARTMENT_FIELDS.name.field}
      getPrimaryText={(department) => department.name}
    />
  );
};

export default DepartmentCatalogPage;
