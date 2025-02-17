import * as React from 'react';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Employee, EmployeeDTO, Module, SubModule } from 'shared/models';
import Form, { FieldProps } from 'components/UI/Form';
import LoadingButton from 'components/UI/LoadingButton';

interface EmployeeDetailsFormProps {
  module: Module;
  subModule: SubModule;
  fields: FieldProps<Employee>[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionLoading?: boolean;
  withCancel?: boolean;
  formLoading?: boolean;
  data?: EmployeeDTO;
  headerText?: string;
  onSubmit: (data: EmployeeDTO) => void;
  onCancel?: () => void;
}

const EmployeeDetailsForm: React.FC<EmployeeDetailsFormProps> = ({
  module,
  subModule,
  data,
  actionLabel = 'Save',
  actionIcon = <SaveIcon />,
  actionLoading = false,
  withCancel = false,
  headerText = 'Profile Details',
  fields,
  formLoading,
  onSubmit,
  onCancel,
}) => {
  const defaultValues: Employee = {
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    fullName: data?.fullName ?? '',
    assignedBranchId: data?.assignedBranchId || null,
  };

  const handleFormSubmit = (formValue: EmployeeDTO) => {
    onSubmit(formValue);
  };

  const handleFormCancel = () => {
    if (onCancel) {
      onCancel();
    }
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
      <Form.Header>{headerText}</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions>
        {withCancel && (
          <Button
            data-cy={`${module}-${subModule}-form-cancel-button`}
            aria-label="Cancel Employee"
            variant="text"
            color="secondary"
            onClick={handleFormCancel}
          >
            Cancel
          </Button>
        )}
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
