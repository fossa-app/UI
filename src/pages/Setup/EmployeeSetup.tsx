import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectEmployee, createEmployee, selectUser, fetchEmployee } from 'store/features';
import { Employee } from 'shared/models';
import EmployeeDetailsForm from './components/EmployeeDetailsForm';

const EmployeeSetupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: employee, fetchStatus, updateStatus } = useAppSelector(selectEmployee);
  const { data: user } = useAppSelector(selectUser);

  const handleSubmit = (value: Employee) => {
    dispatch(createEmployee(value));
  };

  React.useEffect(() => {
    if (!employee && fetchStatus === 'idle') {
      dispatch(fetchEmployee());
    }
  }, [employee, fetchStatus]);

  return (
    <EmployeeDetailsForm
      title="Create an Employee"
      loading={updateStatus === 'loading'}
      userProfile={user?.profile}
      onSubmit={handleSubmit}
    />
  );
};

export default EmployeeSetupPage;
