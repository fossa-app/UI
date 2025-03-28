import * as React from 'react';
import { FieldErrors } from 'react-hook-form';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { Company, Module, SubModule } from 'shared/models';
import { MESSAGES } from 'shared/constants';
import Form, { FieldProps } from 'components/UI/Form';
import LoadingButton from 'components/UI/LoadingButton';

interface CompanyDetailsFormProps {
  module: Module;
  subModule: SubModule;
  isAdmin: boolean;
  fields: FieldProps<Company>[];
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionLoading?: boolean;
  withCancel?: boolean;
  formLoading?: boolean;
  data?: Company;
  errors?: FieldErrors<Company>;
  onSubmit: (formValue: Company) => void;
  onCancel?: () => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  module,
  subModule,
  isAdmin,
  data,
  errors,
  actionLabel = 'Save',
  actionIcon = <SaveIcon />,
  actionLoading = false,
  withCancel = false,
  fields,
  formLoading,
  onSubmit,
  onCancel,
}) => {
  const defaultValues: Company = {
    name: '',
    countryCode: '',
  };

  const handleFormSubmit = (formValue: Company) => {
    onSubmit(formValue);
  };

  const handleFormCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form<Company>
      module={module}
      subModule={subModule}
      defaultValues={defaultValues}
      values={data}
      errors={errors}
      loading={formLoading}
      onSubmit={handleFormSubmit}
    >
      <Form.Header>Company Details</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions generalValidationMessage={isAdmin ? undefined : MESSAGES.error.general.permission}>
        {withCancel && (
          <Button
            data-cy={`${module}-${subModule}-form-cancel-button`}
            aria-label="Cancel Company"
            variant="text"
            color="secondary"
            onClick={handleFormCancel}
          >
            Cancel
          </Button>
        )}
        <LoadingButton
          data-cy={`${module}-${subModule}-form-action-button`}
          aria-label="Save Company"
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

export default CompanyDetailsForm;
