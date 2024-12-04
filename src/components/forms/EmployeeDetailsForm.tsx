import * as React from 'react';
import { Employee, EmployeeDTO, Module, SubModule } from 'shared/models';
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
  onSubmit: (data: EmployeeDTO) => void;
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

  const handleFormSubmit = (formValue: EmployeeDTO) => {
    onSubmit(formValue);
  };

  return (
    <Form<Employee, EmployeeDTO>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      onSubmit={handleFormSubmit}
    >
      <Form.Header>Employee Details</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions actionLabel={buttonLabel} actionIcon={buttonIcon} actionLoading={buttonLoading} />
    </Form>
  );
};

export default EmployeeDetailsForm;
