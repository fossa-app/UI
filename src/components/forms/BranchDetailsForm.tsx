import * as React from 'react';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { BranchDTO, Module, SubModule } from 'shared/models';
import { MESSAGES } from 'shared/constants';
import Form, { FieldProps } from 'components/UI/Form';
import LoadingButton from 'components/UI/LoadingButton';

interface BranchDetailsFormProps {
  module: Module;
  subModule: SubModule;
  isAdmin: boolean;
  fields: FieldProps[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionLoading?: boolean;
  withCancel?: boolean;
  formLoading?: boolean;
  data?: BranchDTO;
  onSubmit: (data: BranchDTO) => void;
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
  onCancel,
}) => {
  const defaultValues: BranchDTO = {
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

  const handleFormSubmit = (formValue: BranchDTO) => {
    onSubmit(formValue);
  };

  const handleFormCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form<BranchDTO>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      loading={formLoading}
      onSubmit={handleFormSubmit}
    >
      <Form.Header>Branch Details</Form.Header>

      <Form.Content fields={fields} />

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
