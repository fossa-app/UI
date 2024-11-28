import * as React from 'react';
import { Employee, Module, SubModule } from 'shared/models';
import Form, { FieldProps } from 'components/UI/Form';

interface EmployeeDetailsFormProps {
  module: Module;
  subModule: SubModule;
  buttonLoading: boolean;
  fields: FieldProps[];
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  formLoading?: boolean;
  data?: Employee;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Employee) => void;
}

const EmployeeDetailsForm: React.FC<EmployeeDetailsFormProps> = ({
  module,
  subModule,
  data,
  buttonLabel,
  buttonIcon,
  fields,
  formLoading,
  buttonLoading,
  onSubmit,
}) => {
  const defaultValues: Employee = {
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    fullName: data?.fullName ?? '',
  };

  const handleFormSubmit = (formValue: Employee) => {
    onSubmit(formValue);
  };

  return (
    <Form<Employee>
      module={module}
      subModule={subModule}
      fields={fields}
      defaultValues={defaultValues}
      loading={formLoading}
      actionLabel={buttonLabel}
      actionIcon={buttonIcon}
      actionLoading={buttonLoading}
      onSubmit={handleFormSubmit}
    />
  );
};

export default EmployeeDetailsForm;
