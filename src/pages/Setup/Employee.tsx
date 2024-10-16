import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectIsUserAdmin, selectEmployee, createEmployee, selectUser } from 'store/features';
import { Employee } from 'shared/models';
import EmployeeDetailsForm from './components/EmployeeDetailsForm';

const EmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { updateStatus, error } = useAppSelector(selectEmployee);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { data: user } = useAppSelector(selectUser);

  const handleSubmit = (value: Employee) => {
    dispatch(createEmployee(value));
  };

  return (
    <EmployeeDetailsForm
      title="Create an Employee"
      isAdmin={isUserAdmin}
      error={error}
      loading={updateStatus === 'loading'}
      userProfile={user?.profile}
      onSubmit={handleSubmit}
    />
  );
};

export default EmployeePage;
