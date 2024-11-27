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
  const defaultValues = {
    id: undefined,
    companyId: undefined,
    ...data,
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
      values={data}
      loading={formLoading}
      actionLabel={buttonLabel}
      actionIcon={buttonIcon}
      actionLoading={buttonLoading}
      onSubmit={handleFormSubmit}
    />
  );
};

export default EmployeeDetailsForm;
