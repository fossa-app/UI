import React from 'react';
import { Module, SubModule, Employee } from 'shared/models';
import { selectEmployeeCatalog, updateEmployeesPagination, resetEmployeesFetchStatus, resetEmployeesPagination } from 'store/features';
import { fetchEmployees } from 'store/thunks';
import { EMPLOYEE_FIELDS, EMPLOYEE_TABLE_SCHEMA, EMPLOYEE_TABLE_ACTIONS_SCHEMA, ROUTES } from 'shared/constants';
import Catalog from 'components/Catalog';

const testModule = Module.employeeManagement;
const testSubModule = SubModule.employeeCatalog;

const EmployeeCatalogPage: React.FC = () => {
  return (
    <Catalog<Employee>
      module={testModule}
      subModule={testSubModule}
      pageTitle="Employees"
      noRecordsLabel="No Employees Found"
      viewPath={ROUTES.viewEmployee.path}
      editPath={ROUTES.editEmployee.path}
      fetchAction={fetchEmployees}
      updatePagination={updateEmployeesPagination}
      resetFetchStatus={resetEmployeesFetchStatus}
      resetPagination={resetEmployeesPagination}
      selectCatalog={selectEmployeeCatalog}
      tableSchema={EMPLOYEE_TABLE_SCHEMA}
      tableActionsSchema={EMPLOYEE_TABLE_ACTIONS_SCHEMA}
      primaryField={EMPLOYEE_FIELDS.firstName.field}
      getPrimaryText={(employee) => employee.firstName}
    />
  );
};

export default EmployeeCatalogPage;
