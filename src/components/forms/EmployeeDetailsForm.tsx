import * as React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { EmployeeDTO, Module, SubModule } from 'shared/models';
import Form, { FieldProps } from 'components/UI/Form';
import LoadingButton from 'components/UI/LoadingButton';

interface EmployeeDetailsFormProps {
  module: Module;
  subModule: SubModule;
  fields: FieldProps[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionLoading?: boolean;
  formLoading?: boolean;
  data?: EmployeeDTO;
  onSubmit: (data: EmployeeDTO) => void;
}

const EmployeeDetailsForm: React.FC<EmployeeDetailsFormProps> = ({
  module,
  subModule,
  data,
  actionLabel = 'Finish',
  actionIcon = <DoneIcon />,
  actionLoading = false,
  fields,
  formLoading,
  onSubmit,
}) => {
  const defaultValues: EmployeeDTO = {
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    fullName: data?.fullName ?? '',
  };

  const handleFormSubmit = (formValue: EmployeeDTO) => {
    onSubmit(formValue);
  };

  return (
    <Form<EmployeeDTO>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      onSubmit={handleFormSubmit}
    >
      <Form.Header>Employee Details</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions>
        <LoadingButton
          data-cy={`${module}-${subModule}-form-action-button`}
          aria-label="Save Employee"
          type="submit"
          loadingPosition="end"
          loading={actionLoading}
          endIcon={actionIcon}
        >
          {actionLabel}
        </LoadingButton>
      </Form.Actions>
    </Form>
  );
};

export default EmployeeDetailsForm;
