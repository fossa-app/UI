import React from 'react';
import { useParams } from 'react-router-dom';
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
import { Department, DepartmentDTO, Employee } from 'shared/models';
import {
  mapDisabledFields,
  deepCopyObject,
  mapDepartmentDTO,
  mapDepartmentFieldOptionsToFieldOptions,
  compareBigIds,
} from 'shared/helpers';
import { useOnFormSubmitEffect, useSafeNavigateBack } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const ManageDepartmentPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const { item: department, updateError, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectDepartment);
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
  const safeNavigateBack = useSafeNavigateBack(ROUTES.departments.path);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
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
      ? [{ id: department.managerId, name: department.managerName } as unknown as Employee, ...managers]
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

  const handleSuccess = () => {
    safeNavigateBack();
    dispatch(resetDepartmentsFetchStatus());
    dispatch(resetDepartment());
  };

  const handleCancel = () => {
    safeNavigateBack();
  };

  const handleSubmit = (formValue: Department) => {
    const submitData = mapDepartmentDTO(formValue);

    if (id) {
      dispatch(editDepartment([id, submitData]));
    } else {
      dispatch(createDepartment(submitData));
    }

    setFormSubmitted(true);
  };

  const actions = DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
    switch (action.name) {
      case FormActionName.cancel:
        return { ...action, onClick: handleCancel };
      case FormActionName.submit:
        return { ...action, loading: updateStatus === 'loading' };
      default:
        return action;
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

  React.useEffect(() => {
    if (id && (!department || !compareBigIds(department.id, id))) {
      dispatch(fetchDepartmentById({ id, skipState: false }));
    }
  }, [id, department, dispatch]);

  React.useEffect(() => {
    if (!id) {
      dispatch(resetDepartment());
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(resetDepartmentErrors());
    };
  }, [dispatch]);

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle={id ? 'Edit Department' : 'Create Department'}
      fallbackRoute={ROUTES.departments.path}
      displayNotFoundPage={fetchStatus === 'failed' && !department}
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
        <Form.Actions actions={actions}></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default ManageDepartmentPage;
