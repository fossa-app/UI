import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectIsUserAdmin,
  selectUserRoles,
  createDepartment,
  resetDepartment,
  fetchDepartmentById,
  resetDepartmentsFetchStatus,
  selectDepartment,
  editDepartment,
  selectManagers,
  fetchParentDepartments,
  selectParentDepartments,
  updateParentDepartmentsPagination,
  resetParentDepartmentsFetchStatus,
  fetchManagers,
  updateManagersPagination,
  resetManagersFetchStatus,
} from 'store/features';
import {
  APP_CONFIG,
  DEPARTMENT_DETAILS_FORM_DEFAULT_VALUES,
  DEPARTMENT_FIELDS,
  DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA,
  MESSAGES,
  ROUTES,
} from 'shared/constants';
import { Department, Employee } from 'shared/models';
import { mapDisabledFields, deepCopyObject, mapDepartmentDTO, mapDepartmentFieldOptionsToFieldOptions } from 'shared/helpers';
import { useOnFormSubmitEffect } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const ManageDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const { data: department, error, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectDepartment);
  const {
    data: parentDepartments,
    fetchStatus: parentDepartmentsFetchStatus,
    page: parentDepartmentsPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectParentDepartments);
  const {
    data: managers,
    fetchStatus: managersFetchStatus,
    page: managersPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectManagers);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const parentDepartmentsLoading = parentDepartmentsFetchStatus === 'loading';
  const managersLoading = managersFetchStatus === 'loading';

  const handleParentDepartmentsScrollEnd = React.useCallback(() => {
    if (parentDepartmentsPage.pageNumber! < parentDepartmentsPage.totalPages!) {
      dispatch(updateParentDepartmentsPagination({ pageNumber: parentDepartmentsPage.pageNumber! + 1 }));
      dispatch(resetParentDepartmentsFetchStatus());
    }
  }, [parentDepartmentsPage, dispatch]);

  const handleManagersScrollEnd = React.useCallback(() => {
    if (managersPage.pageNumber! < managersPage.totalPages!) {
      dispatch(updateManagersPagination({ pageNumber: managersPage.pageNumber! + 1 }));
      dispatch(resetManagersFetchStatus());
    }
  }, [managersPage, dispatch]);

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const parentDepartmentItems = React.useMemo(() => {
    const parentDepartmentList = parentDepartments?.items || [];
    const isParentDepartmentOptionAvailable = parentDepartmentList.some(
      (parentDepartmentItem) => String(parentDepartmentItem.id) === String(department?.parentDepartmentId)
    );

    return department?.parentDepartmentId && !isParentDepartmentOptionAvailable
      ? [{ id: department.parentDepartmentId, name: department.parentDepartmentName } as Department, ...parentDepartmentList]
      : parentDepartmentList;
  }, [parentDepartments?.items, department?.parentDepartmentId, department?.parentDepartmentName]);

  const managerItems = React.useMemo(() => {
    const managertList = managers?.items || [];
    const isManagerOptionAvailable = managertList.some((managertItem) => String(managertItem.id) === String(department?.managerId));

    return department?.managerId && !isManagerOptionAvailable
      ? [{ id: department.managerId, name: department.managerName } as unknown as Employee, ...managertList]
      : managertList;
  }, [managers?.items, department?.managerId, department?.managerName]);

  const fields = React.useMemo(() => {
    const disabledFields = mapDisabledFields(DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, userRoles);
    const mappedFields = mapDepartmentFieldOptionsToFieldOptions(disabledFields, parentDepartmentItems, managerItems);

    return mappedFields.map((field) => {
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
  }, [
    userRoles,
    parentDepartmentItems,
    managerItems,
    parentDepartmentsLoading,
    managersLoading,
    handleParentDepartmentsScrollEnd,
    handleManagersScrollEnd,
  ]);

  const handleCancel = React.useCallback(() => {
    dispatch(resetDepartment());
    navigate(ROUTES.departments.path);
  }, [navigate, dispatch]);

  const handleSuccess = React.useCallback(() => {
    dispatch(resetDepartment());
    navigate(ROUTES.departments.path);
  }, [dispatch, navigate]);

  const actions = React.useMemo(
    () =>
      DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
        switch (action.name) {
          case FormActionName.cancel:
            return { ...action, onClick: handleCancel };
          case FormActionName.submit:
            return { ...action, loading: updateStatus === 'loading' };
          default:
            return action;
        }
      }),
    [updateStatus, handleCancel]
  );

  React.useEffect(() => {
    if (id) {
      dispatch(fetchDepartmentById({ id, skipState: false }));
    } else {
      dispatch(resetDepartment());
    }
  }, [id, dispatch]);

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

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  React.useEffect(() => {
    return () => {
      if (formSubmitted) {
        dispatch(resetDepartmentsFetchStatus());
      }
    };
  }, [formSubmitted, dispatch]);

  const handleSubmit = (formValue: Department) => {
    const submitData = mapDepartmentDTO(formValue);

    if (id) {
      dispatch(editDepartment([id, submitData]));
    } else {
      dispatch(createDepartment(submitData));
    }

    setFormSubmitted(true);
  };

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle={id ? 'Edit Department' : 'Create Department'}
      displayNotFoundPage={fetchStatus === 'failed' && !department}
      onBackButtonClick={handleCancel}
    >
      <Form<Department>
        module={testModule}
        subModule={testSubModule}
        defaultValues={DEPARTMENT_DETAILS_FORM_DEFAULT_VALUES}
        values={department}
        errors={errors}
        loading={fetchStatus === 'loading'}
        onSubmit={handleSubmit}
      >
        <Form.Header>{DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.title}</Form.Header>

        <Form.Content fields={fields} />

        <Form.Actions
          actions={actions}
          generalValidationMessage={isUserAdmin ? undefined : MESSAGES.error.general.permission}
        ></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default ManageDepartmentPage;
