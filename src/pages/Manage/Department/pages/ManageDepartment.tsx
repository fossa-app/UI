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
  selectEmployees,
  fetchEmployees,
  selectDepartments,
  fetchDepartments,
} from 'store/features';
import {
  APP_CONFIG,
  DEPARTMENT_DETAILS_FORM_DEFAULT_VALUES,
  DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA,
  MESSAGES,
  ROUTES,
} from 'shared/constants';
import { Department } from 'shared/models';
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
    data: departments,
    page: departmentsPage = APP_CONFIG.table.defaultPagination,
    fetchStatus: departmentsFetchStatus,
  } = useAppSelector(selectDepartments);
  const {
    data: employees,
    fetchStatus: employeesFetchStatus,
    page: employeesPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectEmployees);
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const fields = React.useMemo(() => {
    const disabledFields = mapDisabledFields(DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, userRoles);
    const mappedFields = mapDepartmentFieldOptionsToFieldOptions(disabledFields, departments?.items, employees?.items);

    return mappedFields;
  }, [userRoles, departments, employees]);

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
    if (employeesFetchStatus === 'idle') {
      dispatch(fetchEmployees([employeesPage, false]));
    }
  }, [employeesFetchStatus, employeesPage, dispatch]);

  React.useEffect(() => {
    if (departmentsFetchStatus === 'idle') {
      dispatch(fetchDepartments([departmentsPage]));
    }
  }, [departmentsFetchStatus, departmentsPage, dispatch]);

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
