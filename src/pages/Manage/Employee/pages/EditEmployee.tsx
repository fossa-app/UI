import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectEmployee,
  editEmployee,
  fetchEmployeeById,
  resetEmployeesFetchStatus,
  selectAssignedBranches,
  resetEmployee,
  updateAssignedBranchesPagination,
  resetAssignedBranchesFetchStatus,
  fetchAssignedBranches,
} from 'store/features';
import { APP_CONFIG, EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES, EMPLOYEE_DETAILS_FORM_SCHEMA, EMPLOYEE_FIELDS, ROUTES } from 'shared/constants';
import { Branch, Employee } from 'shared/models';
import { deepCopyObject, mapBranchToFieldOption, mapEmployeeDTO } from 'shared/helpers';
import { useOnFormSubmitEffect } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = EMPLOYEE_DETAILS_FORM_SCHEMA.module;
const testSubModule = EMPLOYEE_DETAILS_FORM_SCHEMA.subModule;

const EditEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: employee, error, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectEmployee);
  const {
    data: assignedBranches,
    fetchStatus: assignedBranchesFetchStatus,
    page: assignedBranchesPage = APP_CONFIG.table.defaultPagination,
  } = useAppSelector(selectAssignedBranches);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
  const defaultValues: Employee = employee || EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES;

  const handleAssignedBranchesScrollEnd = React.useCallback(() => {
    if (assignedBranchesPage.pageNumber! < assignedBranchesPage.totalPages!) {
      dispatch(updateAssignedBranchesPagination({ pageNumber: assignedBranchesPage.pageNumber! + 1 }));
      dispatch(resetAssignedBranchesFetchStatus());
    }
  }, [assignedBranchesPage, dispatch]);

  const branchItems = React.useMemo(() => {
    const branchList = assignedBranches?.items || [];
    const isBranchOptionAvailable = branchList.some((branchItem) => String(branchItem.id) === String(employee?.assignedBranchId));

    return employee?.assignedBranchId && !isBranchOptionAvailable
      ? [{ id: employee.assignedBranchId, name: employee.assignedBranchName } as Branch, ...branchList]
      : branchList;
  }, [assignedBranches?.items, employee?.assignedBranchId, employee?.assignedBranchName]);

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const handleSuccess = React.useCallback(() => {
    navigate(ROUTES.employees.path);
    dispatch(resetEmployeesFetchStatus());
  }, [navigate, dispatch]);

  const handleCancel = React.useCallback(() => {
    navigate(ROUTES.employees.path);
  }, [navigate]);

  const fields = React.useMemo(
    () =>
      EMPLOYEE_DETAILS_FORM_SCHEMA.fields.map((field) =>
        field.name === EMPLOYEE_FIELDS.assignedBranchId?.field
          ? {
              ...field,
              loading: assignedBranchesFetchStatus === 'loading',
              options: branchItems.map(mapBranchToFieldOption) || [],
              onScrollEnd: handleAssignedBranchesScrollEnd,
            }
          : field
      ),
    [branchItems, assignedBranchesFetchStatus, handleAssignedBranchesScrollEnd]
  );

  const actions = React.useMemo(
    () =>
      EMPLOYEE_DETAILS_FORM_SCHEMA.actions.map((action) => {
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
    if (assignedBranchesFetchStatus === 'idle') {
      dispatch(fetchAssignedBranches(assignedBranchesPage));
    }
  }, [assignedBranchesFetchStatus, assignedBranchesPage, dispatch]);

  React.useEffect(() => {
    if (id && fetchStatus === 'idle') {
      dispatch(fetchEmployeeById({ id, shouldFetchBranchGeoAddress: false }));
    }
  }, [id, fetchStatus, dispatch]);

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  React.useEffect(() => {
    return () => {
      dispatch(resetEmployee());
    };
  }, [dispatch]);

  const handleSubmit = (formValue: Employee) => {
    const submitData = mapEmployeeDTO(formValue);

    dispatch(editEmployee([id!, submitData]));
    setFormSubmitted(true);
  };

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle="Edit Employee Branch"
      displayNotFoundPage={fetchStatus === 'failed' && !employee}
      onBackButtonClick={handleCancel}
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

export default EditEmployeePage;
