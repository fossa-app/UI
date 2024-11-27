import * as React from 'react';
import { Branch, Module, SubModule } from 'shared/models';
import { MESSAGES } from 'shared/constants';
import Form, { FieldProps } from 'components/UI/Form';

interface BrachDetailsFormProps {
  module: Module;
  subModule: SubModule;
  isAdmin: boolean;
  buttonLoading: boolean;
  fields: FieldProps[];
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  formLoading?: boolean;
  data?: Branch;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Branch) => void;
}

const BrachDetailsForm: React.FC<BrachDetailsFormProps> = ({
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
  const defaultValues = {
    id: undefined,
    companyId: undefined,
    name: '',
  };

  const handleFormSubmit = (formValue: Branch) => {
    onSubmit(formValue);
  };

  return (
    <Form<Branch>
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

export default BrachDetailsForm;
