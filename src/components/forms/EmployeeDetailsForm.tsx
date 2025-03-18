import * as React from 'react';
import { FieldErrors } from 'react-hook-form';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Employee, Module, SubModule } from 'shared/models';
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
  data?: Employee;
  errors?: FieldErrors<Employee>;
  headerText?: string;
  onSubmit: (formValue: Employee) => void;
  onCancel?: () => void;
}

const EmployeeDetailsForm: React.FC<EmployeeDetailsFormProps> = ({
  module,
  subModule,
  data,
  errors,
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
    assignedBranchId: data?.assignedBranchId ?? null,
  };

  const handleFormSubmit = (formValue: Employee) => {
    onSubmit(formValue);
  };

  const handleFormCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form<Employee>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      errors={errors}
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
