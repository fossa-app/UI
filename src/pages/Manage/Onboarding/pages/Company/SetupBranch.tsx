import * as React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createBranch,
  selectBranch,
  selectIsUserAdmin,
  selectCompanyTimeZones,
  selectUserRoles,
  selectCompany,
  selectSystemCountries,
} from 'store/features';
import { Branch } from 'shared/models';
import {
  getBranchManagementDetailsByAddressFormSchema,
  mapBranchDTO,
  mapDisabledFields,
  mapBranchFieldOptionsToFieldOptions,
  deepCopyObject,
  hasAllowedRole,
} from 'shared/helpers';
import { BRANCH_SETUP_DETAILS_FORM_SCHEMA, BRANCH_DETAILS_FORM_DEFAULT_VALUES, MESSAGES } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = BRANCH_SETUP_DETAILS_FORM_SCHEMA.module;
const testSubModule = BRANCH_SETUP_DETAILS_FORM_SCHEMA.subModule;

const SetupBranchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { data: company } = useAppSelector(selectCompany);
  const { updateStatus, error } = useAppSelector(selectBranch);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const countries = useAppSelector(selectSystemCountries);
  const [noPhysicalAddress, setNoPhysicalAddress] = React.useState<boolean | undefined>(undefined);

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode) || [],
    [countries, company]
  );

  const fields = React.useMemo(() => {
    const schema = getBranchManagementDetailsByAddressFormSchema(BRANCH_SETUP_DETAILS_FORM_SCHEMA.fields, !!noPhysicalAddress);
    const disabledFields = mapDisabledFields(schema, userRoles);
    const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, companyTimeZones, availableCountries);

    return mappedFields;
  }, [noPhysicalAddress, userRoles, companyTimeZones, availableCountries]);

  const actions = React.useMemo(
    () =>
      BRANCH_SETUP_DETAILS_FORM_SCHEMA.actions.map((action) =>
        action.name === FormActionName.submit
          ? { ...action, disabled: !hasAllowedRole(action.roles, userRoles), loading: updateStatus === 'loading' }
          : action
      ),
    [userRoles, updateStatus]
  );

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const handleSubmit = (formValue: Branch) => {
    const submitData = mapBranchDTO(formValue);

    dispatch(createBranch([submitData]));
  };

  const handleChange = (formValue: Branch) => {
    setNoPhysicalAddress(formValue.noPhysicalAddress);
  };

  return (
    <Form<Branch>
      module={testModule}
      subModule={testSubModule}
      defaultValues={BRANCH_DETAILS_FORM_DEFAULT_VALUES}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <Form.Header>{BRANCH_SETUP_DETAILS_FORM_SCHEMA.title}</Form.Header>

      <Form.Content fields={fields} />

      <Form.Actions actions={actions} generalValidationMessage={isUserAdmin ? undefined : MESSAGES.error.general.permission}></Form.Actions>
    </Form>
  );
};

export default SetupBranchPage;
