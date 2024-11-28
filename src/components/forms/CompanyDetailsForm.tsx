import * as React from 'react';
import { Company, Module, SubModule } from 'shared/models';
import { MESSAGES } from 'shared/constants';
import Form, { FieldProps } from 'components/UI/Form';

interface CompanyDetailsFormProps {
  module: Module;
  subModule: SubModule;
  isAdmin: boolean;
  buttonLoading: boolean;
  fields: FieldProps[];
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  formLoading?: boolean;
  data?: Company;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Company) => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  module,
  subModule,
  isAdmin,
  data,
  buttonLabel,
  buttonIcon,
  fields,
  formLoading,
  buttonLoading,
  onSubmit,
}) => {
  const defaultValues: Company = {
    name: '',
  };

  const handleFormSubmit = (formValue: Company) => {
    onSubmit(formValue);
  };

  return (
    <Form<Company>
      module={module}
      subModule={subModule}
      fields={fields}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      actionLabel={buttonLabel}
      actionIcon={buttonIcon}
      actionLoading={buttonLoading}
      actionDisabled={!isAdmin}
      generalValidationMessage={isAdmin ? undefined : MESSAGES.error.general.permission}
      onSubmit={handleFormSubmit}
    />
  );
};

export default CompanyDetailsForm;
