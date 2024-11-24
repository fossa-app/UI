import * as React from 'react';
import { Branch, Module, SubModule } from 'shared/models';
import Form from 'components/UI/Form';
import { BRANCH_DETAILS_FORM_SCHEMA } from 'shared/constants';

interface BrachDetailsFormProps {
  formLoading: boolean;
  buttonLoading: boolean;
  data?: Branch;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Branch) => void;
}

const BrachDetailsForm: React.FC<BrachDetailsFormProps> = ({ data, formLoading, buttonLoading, onSubmit }) => {
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
      module={Module.branchManagement}
      subModule={SubModule.branchDetails}
      fields={BRANCH_DETAILS_FORM_SCHEMA}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      actionLoading={buttonLoading}
      onSubmit={handleFormSubmit}
    />
  );
};

export default BrachDetailsForm;
