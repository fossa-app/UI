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
  const defaultValues: Branch = {
    name: '',
  };

  const handleFormSubmit = (formValue: Branch) => {
    onSubmit(formValue);
  };

  return (
    <Form<Branch>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      onSubmit={handleFormSubmit}
    >
      <Form.Header>Branch Details</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions
        actionLoading={buttonLoading}
        actionDisabled={!isAdmin}
        actionLabel={buttonLabel}
        actionIcon={buttonIcon}
        generalValidationMessage={isAdmin ? undefined : MESSAGES.error.general.permission}
      />
    </Form>
  );
};

export default BrachDetailsForm;
