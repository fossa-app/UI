import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectEmployee,
  editEmployee,
  fetchEmployeeById,
  resetEmployeesFetchStatus,
  selectSearchedBranches,
  fetchSearchedBranches,
  resetEmployee,
} from 'store/features';
import { EMPLOYEE_DETAILS_FORM_SCHEMA, EMPLOYEE_FIELDS, ROUTES } from 'shared/constants';
import { Branch, Employee, Module, SubModule } from 'shared/models';
import { deepCopyObject, mapBranchToFieldOption, mapEmployeeDTO } from 'shared/helpers';
import EmployeeDetailsForm from 'components/forms/EmployeeDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const testModule = Module.employeeManagement;
const testSubModule = SubModule.employeeDetails;

const EditEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: employee, error, fetchStatus, updateStatus } = useAppSelector(selectEmployee);
  const { data: branches, fetchStatus: searchedBranchesStatus } = useAppSelector(selectSearchedBranches);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const branchItems = React.useMemo(() => {
    const branchList = branches?.items || [];
    const isBranchOptionAvailable = branchList.some((branchItem) => String(branchItem.id) === String(employee?.assignedBranchId));

    return employee?.assignedBranchId && !isBranchOptionAvailable
      ? [...branchList, { id: employee.assignedBranchId, name: employee.assignedBranchName } as Branch]
      : branchList;
  }, [branches?.items, employee?.assignedBranchId, employee?.assignedBranchName]);

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const handleBranchSearch = React.useCallback(
    (_: unknown, search: string) => {
      const isBranchOptionAvailable =
        branchItems.some((branchItem) => String(branchItem.id) === String(employee?.assignedBranchId)) &&
        branchItems.some((branchItem) => branchItem.name.toLowerCase().includes(search.toLowerCase()));

      if (search && !isBranchOptionAvailable) {
        // TODO: load lazy and paginated
        dispatch(fetchSearchedBranches({ search, pageNumber: 1, pageSize: 100 }));
      }
    },
    [branchItems, employee?.assignedBranchId, dispatch]
  );

  const fields = React.useMemo(
    () =>
      EMPLOYEE_DETAILS_FORM_SCHEMA.map((field) =>
        field.name === EMPLOYEE_FIELDS.assignedBranchId?.field
          ? {
              ...field,
              loading: searchedBranchesStatus === 'loading',
              options: branchItems.map(mapBranchToFieldOption),
              onInputChange: handleBranchSearch,
            }
          : field
      ),
    [branchItems, searchedBranchesStatus, handleBranchSearch]
  );

  React.useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
  }, [id, dispatch]);

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetEmployeesFetchStatus());
      navigate(ROUTES.employees.path);
    }
  }, [updateStatus, formSubmitted, navigate, dispatch]);

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

  const handleCancel = () => {
    dispatch(resetEmployee());
    navigate(ROUTES.employees.path);
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
      <EmployeeDetailsForm
        withCancel
        module={testModule}
        subModule={testSubModule}
        headerText="Employee Details"
        actionLoading={updateStatus === 'loading'}
        formLoading={fetchStatus === 'loading'}
        fields={fields}
        data={employee}
        errors={errors}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditEmployeePage;
