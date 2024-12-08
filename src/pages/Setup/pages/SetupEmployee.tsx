import * as React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useAppDispatch, useAppSelector } from 'store';
import { selectEmployee, createEmployee, fetchEmployee, selectUser } from 'store/features';
import { EmployeeDTO, Module, SubModule } from 'shared/models';
import { EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { mapUserProfileToEmployee } from 'shared/helpers';
import EmployeeDetailsForm from 'components/forms/EmployeeDetailsForm';
import FormLayout from 'components/layouts/FormLayout';

const SetupEmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector(selectUser);
  const { data: employee, fetchStatus, updateStatus } = useAppSelector(selectEmployee);

  const handleSubmit = (data: EmployeeDTO) => {
    dispatch(createEmployee(data));
  };

  React.useEffect(() => {
    if (!employee && fetchStatus === 'idle') {
      dispatch(fetchEmployee());
    }
  }, [employee, fetchStatus]);

  return (
    <FormLayout module={Module.employeeSetup} subModule={SubModule.employeeDetails} pageTitle={'Create Employee'}>
      <EmployeeDetailsForm
        module={Module.employeeSetup}
        subModule={SubModule.employeeDetails}
        buttonLabel="Finish"
        buttonIcon={<DoneIcon />}
        buttonLoading={updateStatus === 'loading'}
        fields={EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA}
        data={mapUserProfileToEmployee(user?.profile)}
        onSubmit={handleSubmit}
      />
    </FormLayout>
  );
};

export default SetupEmployeePage;
