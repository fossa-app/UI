import * as React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createOnboardingBranch,
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
import { CREATE_BRANCH_DETAILS_FORM_SCHEMA, BRANCH_DETAILS_FORM_DEFAULT_VALUES, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = CREATE_BRANCH_DETAILS_FORM_SCHEMA.module;
const testSubModule = CREATE_BRANCH_DETAILS_FORM_SCHEMA.subModule;

const CreateBranchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { item: company } = useAppSelector(selectCompany);
  const { updateStatus, updateError: error } = useAppSelector(selectBranch);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const countries = useAppSelector(selectSystemCountries);
  const [noPhysicalAddress, setNoPhysicalAddress] = React.useState<boolean | undefined>(undefined);

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode) || [],
    [countries, company]
  );

  const fields = React.useMemo(() => {
    const schema = getBranchManagementDetailsByAddressFormSchema(CREATE_BRANCH_DETAILS_FORM_SCHEMA.fields, !!noPhysicalAddress);
    const disabledFields = mapDisabledFields(schema, userRoles);
    const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, companyTimeZones, availableCountries);

    return mappedFields;
  }, [noPhysicalAddress, userRoles, companyTimeZones, availableCountries]);

  const actions = React.useMemo(
    () =>
      CREATE_BRANCH_DETAILS_FORM_SCHEMA.actions.map((action) =>
        action.name === FormActionName.submit
          ? { ...action, disabled: !hasAllowedRole(action.roles, userRoles), loading: updateStatus === 'loading' }
          : action
      ),
    [userRoles, updateStatus]
  );

  const errors = React.useMemo(() => {
    if (!isUserAdmin) {
      return USER_PERMISSION_GENERAL_MESSAGE;
    }

    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors, isUserAdmin]);

  const handleSubmit = (formValue: Branch) => {
    const submitData = mapBranchDTO(formValue);

    dispatch(createOnboardingBranch(submitData));
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
      <Form.Header>{CREATE_BRANCH_DETAILS_FORM_SCHEMA.title}</Form.Header>
      <Form.Content fields={fields} />
      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default CreateBranchPage;
