import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectEmployee,
  resetEmployeesFetchStatus,
  selectAssignedBranches,
  resetEmployee,
  updateAssignedBranchesPagination,
  resetAssignedBranchesFetchStatus,
  selectAssignedDepartments,
  updateAssignedDepartmentsPagination,
  resetAssignedDepartmentsFetchStatus,
  selectManagers,
  updateManagersPagination,
  resetManagersFetchStatus,
  resetEmployeeErrors,
  resetProfileFetchStatus,
  selectProfile,
} from 'store/features';
import { fetchAssignedBranches, fetchAssignedDepartments, editEmployee, fetchEmployeeById, fetchManagers } from 'store/thunks';
import { APP_CONFIG, EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES, EMPLOYEE_DETAILS_FORM_SCHEMA, EMPLOYEE_FIELDS, ROUTES } from 'shared/constants';
import { Branch, Department, Employee, EmployeeDTO, EntityInput } from 'shared/types';
import {
  areEqualBigIds,
  deepCopyObject,
  mapBranchToFieldOption,
  mapDepartmentToFieldOption,
  mapEmployeeDTO,
  mapEmployeeToFieldOption,
} from 'shared/helpers';
import { useOnFormSubmitEffect, useSafeNavigateBack } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = EMPLOYEE_DETAILS_FORM_SCHEMA.module;
const testSubModule = EMPLOYEE_DETAILS_FORM_SCHEMA.subModule;

const EmployeeEditPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { item: employee, updateError, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectEmployee);
  const { item: profile } = useAppSelector(selectProfile);
  const {
    status: assignedBranchesFetchStatus,
    items: assignedBranches,
    page: assignedBranchesPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectAssignedBranches);
  const {
    items: assignedDepartments,
    status: assignedDepartmentsFetchStatus,
    page: assignedDepartmentsPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectAssignedDepartments);
  const {
    items: managers,
    status: managersFetchStatus,
    page: managersPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectManagers);
  const safeNavigateBack = useSafeNavigateBack(ROUTES.employees.path);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
  const defaultValues: EntityInput<Employee> = employee || EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES;
  const errors = deepCopyObject(updateError?.errors);

  const handleAssignedBranchesScrollEnd = () => {
    if (assignedBranchesPage.pageNumber! < assignedBranchesPage.totalPages!) {
      dispatch(updateAssignedBranchesPagination({ pageNumber: assignedBranchesPage.pageNumber! + 1 }));
      dispatch(resetAssignedBranchesFetchStatus());
    }
  };

  const handleAssignedDepartmentsScrollEnd = () => {
    if (assignedDepartmentsPage.pageNumber! < assignedDepartmentsPage.totalPages!) {
      dispatch(updateAssignedDepartmentsPagination({ pageNumber: assignedDepartmentsPage.pageNumber! + 1 }));
      dispatch(resetAssignedDepartmentsFetchStatus());
    }
  };

  const handleManagersScrollEnd = () => {
    if (managersPage.pageNumber! < managersPage.totalPages!) {
      dispatch(updateManagersPagination({ pageNumber: managersPage.pageNumber! + 1 }));
      dispatch(resetManagersFetchStatus());
    }
  };

  const handleSuccess = () => {
    safeNavigateBack();
    dispatch(resetEmployeesFetchStatus());
    dispatch(resetEmployee());

    if (profile?.id === employee?.id) {
      dispatch(resetProfileFetchStatus());
    }
  };

  const handleSubmit = (formValue: Employee) => {
    const submitData = mapEmployeeDTO(formValue);

    dispatch(editEmployee([id!, submitData]));
    setFormSubmitted(true);
  };

  const isBranchOptionAvailable = assignedBranches.some((branchItem) => String(branchItem.id) === String(employee?.assignedBranchId));
  const branchItems =
    employee?.assignedBranchId && !isBranchOptionAvailable
      ? [{ id: employee.assignedBranchId, name: employee.assignedBranchName } as Branch, ...assignedBranches]
      : assignedBranches;
  const isDepartmentOptionAvailable = assignedDepartments.some(
    (departmentItem) => String(departmentItem.id) === String(employee?.assignedDepartmentId)
  );
  const departmentItems =
    employee?.assignedDepartmentId && !isDepartmentOptionAvailable
      ? [{ id: employee.assignedDepartmentId, name: employee.assignedDepartmentName } as Department, ...assignedDepartments]
      : assignedDepartments;
  const isManagerOptionAvailable = managers.some((managerItem) => String(managerItem.id) === String(employee?.reportsToId));
  const managerItems =
    employee?.reportsToId && !isManagerOptionAvailable
      ? [{ id: employee.reportsToId, name: employee.reportsToName } as unknown as EmployeeDTO, ...managers]
      : managers;

  const fields = EMPLOYEE_DETAILS_FORM_SCHEMA.fields.map((field) => {
    switch (field.name) {
      case EMPLOYEE_FIELDS.assignedBranchId?.field:
        return {
          ...field,
          loading: assignedBranchesFetchStatus === 'loading',
          options: branchItems.map(mapBranchToFieldOption) ?? [],
          onScrollEnd: handleAssignedBranchesScrollEnd,
        };

      case EMPLOYEE_FIELDS.assignedDepartmentId?.field:
        return {
          ...field,
          loading: assignedDepartmentsFetchStatus === 'loading',
          options: departmentItems.map(mapDepartmentToFieldOption) ?? [],
          onScrollEnd: handleAssignedDepartmentsScrollEnd,
        };

      case EMPLOYEE_FIELDS.reportsToId?.field:
        return {
          ...field,
          loading: managersFetchStatus === 'loading',
          options: managerItems.map(mapEmployeeToFieldOption) ?? [],
          onScrollEnd: handleManagersScrollEnd,
        };

      default:
        return field;
    }
  });

  const actions = EMPLOYEE_DETAILS_FORM_SCHEMA.actions.map((action) => {
    switch (action.name) {
      case FormActionName.cancel:
        return { ...action, onClick: safeNavigateBack };
      case FormActionName.submit:
        return { ...action, loading: updateStatus === 'loading' };
      default:
        return action;
    }
  });

  React.useEffect(() => {
    if (assignedBranchesFetchStatus === 'idle') {
      dispatch(fetchAssignedBranches(assignedBranchesPage));
    }
  }, [assignedBranchesFetchStatus, assignedBranchesPage, dispatch]);

  React.useEffect(() => {
    if (assignedDepartmentsFetchStatus === 'idle') {
      dispatch(fetchAssignedDepartments(assignedDepartmentsPage));
    }
  }, [assignedDepartmentsFetchStatus, assignedDepartmentsPage, dispatch]);

  React.useEffect(() => {
    if (managersFetchStatus === 'idle') {
      dispatch(fetchManagers(managersPage));
    }
  }, [managersFetchStatus, managersPage, dispatch]);

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

  React.useEffect(() => {
    return () => {
      dispatch(resetEmployeeErrors());
    };
  }, [dispatch]);

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle="Edit Employee"
      fallbackRoute={ROUTES.employees.path}
      displayNotFoundPage={fetchStatus === 'failed' && !employee}
    >
      <Form<Employee>
        module={testModule}
        subModule={testSubModule}
        loading={fetchStatus === 'loading'}
        defaultValues={defaultValues}
        values={employee}
        errors={errors}
        onSubmit={handleSubmit}
      >
        <Form.Header>{EMPLOYEE_DETAILS_FORM_SCHEMA.title}</Form.Header>
        <Form.Content fields={fields} />
        <Form.Actions actions={actions}></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default EmployeeEditPage;
