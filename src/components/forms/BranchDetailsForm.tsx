import * as React from 'react';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Branch, Module, SubModule } from 'shared/models';
import { MESSAGES } from 'shared/constants';
import Form, { FieldProps } from 'components/UI/Form';
import LoadingButton from 'components/UI/LoadingButton';

interface BranchDetailsFormProps {
  module: Module;
  subModule: SubModule;
  isAdmin: boolean;
  fields: FieldProps<Branch>[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionLoading?: boolean;
  withCancel?: boolean;
  formLoading?: boolean;
  data?: Branch;
  onSubmit: (data: Branch) => void;
  onChange?: (data: Branch) => void;
  onCancel?: () => void;
}

const BranchDetailsForm: React.FC<BranchDetailsFormProps> = ({
  module,
  subModule,
  isAdmin,
  data,
  actionLabel = 'Save',
  actionIcon = <SaveIcon />,
  actionLoading = false,
  withCancel = false,
  fields,
  formLoading,
  onSubmit,
  onChange,
  onCancel,
}) => {
  const defaultValues: Branch = {
    name: '',
    timeZoneId: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      subdivision: '',
      postalCode: '',
      countryCode: '',
    },
  };

  const handleFormChange = (formValue: Branch) => {
    onChange?.(formValue);
  };

  const handleFormSubmit = (formValue: Branch) => {
    onSubmit(formValue);
  };

  const handleFormCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form<Branch>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
    >
      <Form.Header>Branch Details</Form.Header>

      <Form.Content<Branch> fields={fields} values={data} />

      <Form.Actions generalValidationMessage={isAdmin ? undefined : MESSAGES.error.general.permission}>
        {withCancel && (
          <Button
            data-cy={`${module}-${subModule}-form-cancel-button`}
            aria-label="Cancel Branch"
            variant="text"
            color="secondary"
            onClick={handleFormCancel}
          >
            Cancel
          </Button>
        )}
        <LoadingButton
          data-cy={`${module}-${subModule}-form-action-button`}
          aria-label="Save Branch"
          type="submit"
          loadingPosition="end"
          disabled={!isAdmin}
          loading={actionLoading}
          endIcon={actionIcon}
        >
          {actionLabel}
        </LoadingButton>
      </Form.Actions>
    </Form>
  );
};

export default BranchDetailsForm;
