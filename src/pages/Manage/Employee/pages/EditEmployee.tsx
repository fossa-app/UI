import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectOtherEmployee,
  editOtherEmployee,
  fetchEmployeeById,
  resetEmployeesFetchStatus,
  selectBranches,
  fetchBranches,
  resetOtherEmployee,
} from 'store/features';
import { OTHER_EMPLOYEE_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { Employee, Module, SubModule } from 'shared/models';
import { mapEmployeeBranchesToFieldSelectOptions, mapEmployeeDTO } from 'shared/helpers';
import EmployeeDetailsForm from 'components/forms/EmployeeDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const EditEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: employee, fetchStatus, updateStatus } = useAppSelector(selectOtherEmployee);
  const { data: branches } = useAppSelector(selectBranches);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const fields = React.useMemo(() => {
    return mapEmployeeBranchesToFieldSelectOptions(OTHER_EMPLOYEE_DETAILS_FORM_SCHEMA, branches?.items);
  }, [branches]);

  const handleSubmit = (formValue: Employee) => {
    const submitData = mapEmployeeDTO(formValue);

    dispatch(editOtherEmployee([id!, submitData]));
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    dispatch(resetOtherEmployee());
    navigate(ROUTES.employees.path);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    // TODO: use search
    dispatch(fetchBranches([{ pageSize: 100, pageNumber: 1 }]));
  }, [dispatch]);

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetEmployeesFetchStatus());
      navigate(ROUTES.employees.path);
    }
  }, [updateStatus, formSubmitted, navigate, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(resetOtherEmployee());
    };
  }, [dispatch]);

  return (
    <PageLayout
      withBackButton
      module={Module.employeeManagement}
      subModule={SubModule.employeeDetails}
      pageTitle="Edit Employee Branch"
      displayNotFoundPage={fetchStatus === 'failed' && !employee}
      onBackButtonClick={handleCancel}
    >
      <EmployeeDetailsForm
        withCancel
        module={Module.employeeManagement}
        subModule={SubModule.employeeDetails}
        headerText="Employee Details"
        actionLoading={updateStatus === 'loading'}
        formLoading={fetchStatus === 'loading'}
        fields={fields}
        data={employee}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditEmployeePage;
