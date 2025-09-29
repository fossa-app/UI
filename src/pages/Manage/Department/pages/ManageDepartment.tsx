import React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectIsUserAdmin,
  selectUserRoles,
  resetDepartment,
  resetDepartmentsFetchStatus,
  selectDepartment,
  selectManagers,
  selectParentDepartments,
  updateParentDepartmentsPagination,
  resetParentDepartmentsFetchStatus,
  updateManagersPagination,
  resetManagersFetchStatus,
  resetDepartmentErrors,
} from 'store/features';
import { createDepartment, fetchDepartmentById, editDepartment, fetchParentDepartments, fetchManagers } from 'store/thunks';
import {
  APP_CONFIG,
  DEPARTMENT_DETAILS_FORM_DEFAULT_VALUES,
  DEPARTMENT_FIELDS,
  DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA,
  ROUTES,
  USER_PERMISSION_GENERAL_MESSAGE,
} from 'shared/constants';
import { Department, DepartmentDTO, EmployeeDTO } from 'shared/models';
import { mapDisabledFields, deepCopyObject, mapDepartmentDTO, mapDepartmentFieldOptionsToFieldOptions } from 'shared/helpers';
import ManageEntity from 'components/ManageEntity';

const testModule = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const ManageDepartmentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const { item: department, updateError, fetchStatus } = useAppSelector(selectDepartment);
  const {
    items: parentDepartments,
    status: parentDepartmentsFetchStatus,
    page: parentDepartmentsPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectParentDepartments);
  const {
    items: managers,
    status: managersFetchStatus,
    page: managersPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectManagers);
  const parentDepartmentsLoading = parentDepartmentsFetchStatus === 'loading';
  const managersLoading = managersFetchStatus === 'loading';
  const errors = isUserAdmin ? deepCopyObject(updateError?.errors) : USER_PERMISSION_GENERAL_MESSAGE;

  const handleParentDepartmentsScrollEnd = () => {
    if (parentDepartmentsPage.pageNumber! < parentDepartmentsPage.totalPages!) {
      dispatch(updateParentDepartmentsPagination({ pageNumber: parentDepartmentsPage.pageNumber! + 1 }));
      dispatch(resetParentDepartmentsFetchStatus());
    }
  };

  const handleManagersScrollEnd = () => {
    if (managersPage.pageNumber! < managersPage.totalPages!) {
      dispatch(updateManagersPagination({ pageNumber: managersPage.pageNumber! + 1 }));
      dispatch(resetManagersFetchStatus());
    }
  };

  const isParentDepartmentOptionAvailable = parentDepartments.some(
    (parentDepartmentItem) => String(parentDepartmentItem.id) === String(department?.parentDepartmentId)
  );
  const parentDepartmentItems =
    department?.parentDepartmentId && !isParentDepartmentOptionAvailable
      ? [{ id: department.parentDepartmentId, name: department.parentDepartmentName } as DepartmentDTO, ...parentDepartments]
      : parentDepartments;
  const isManagerOptionAvailable = managers.some((managertItem) => String(managertItem.id) === String(department?.managerId));
  const managerItems =
    department?.managerId && !isManagerOptionAvailable
      ? [{ id: department.managerId, name: department.managerName } as unknown as EmployeeDTO, ...managers]
      : managers;
  const disabledFields = mapDisabledFields(DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, userRoles);
  const mappedFields = mapDepartmentFieldOptionsToFieldOptions(disabledFields, parentDepartmentItems, managerItems);

  const fields = mappedFields.map((field) => {
    switch (field.name) {
      case DEPARTMENT_FIELDS.parentDepartmentId.field:
        return {
          ...field,
          loading: parentDepartmentsLoading,
          onScrollEnd: handleParentDepartmentsScrollEnd,
        };
      case DEPARTMENT_FIELDS.managerId.field:
        return {
          ...field,
          loading: managersLoading,
          onScrollEnd: handleManagersScrollEnd,
        };
      default:
        return field;
    }
  });

  React.useEffect(() => {
    if (managersFetchStatus === 'idle') {
      dispatch(fetchManagers(managersPage));
    }
  }, [managersFetchStatus, managersPage, dispatch]);

  React.useEffect(() => {
    if (parentDepartmentsFetchStatus === 'idle') {
      dispatch(fetchParentDepartments(parentDepartmentsPage));
    }
  }, [parentDepartmentsFetchStatus, parentDepartmentsPage, dispatch]);

  return (
    <ManageEntity<Department, DepartmentDTO>
      module={testModule}
      subModule={testSubModule}
      pageTitle={{ create: 'Create Department', edit: 'Edit Department' }}
      fallbackRoute={ROUTES.departments.path}
      defaultValues={DEPARTMENT_DETAILS_FORM_DEFAULT_VALUES}
      fields={fields}
      formSchema={DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA}
      formLoading={fetchStatus === 'loading'}
      errors={errors}
      selectEntity={selectDepartment}
      resetEntity={resetDepartment}
      resetErrors={resetDepartmentErrors}
      resetCatalogFetchStatus={resetDepartmentsFetchStatus}
      fetchEntityAction={(params) => fetchDepartmentById({ id: params.id, skipState: false })}
      createEntityAction={createDepartment}
      editEntityAction={editDepartment}
      mapDTO={mapDepartmentDTO}
    />
  );
};

export default ManageDepartmentPage;
