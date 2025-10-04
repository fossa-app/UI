import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'store';
import {
  resetBranch,
  resetBranchesFetchStatus,
  selectBranch,
  selectIsUserAdmin,
  selectCompanyTimeZones,
  selectUserRoles,
  selectCompany,
  selectSystemCountries,
  resetBranchErrors,
} from 'store/features';
import { createBranch, editBranch, fetchBranchById } from 'store/thunks';
import {
  BRANCH_DETAILS_FORM_DEFAULT_VALUES,
  BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA,
  ROUTES,
  USER_PERMISSION_GENERAL_MESSAGE,
} from 'shared/constants';
import { Branch, BranchDTO, TimeZone } from 'shared/models';
import {
  getBranchManagementDetailsByAddressFormSchema,
  mapBranchDTO,
  mapDisabledFields,
  mapBranchFieldOptionsToFieldOptions,
  deepCopyObject,
} from 'shared/helpers';
import { FormFieldProps } from 'components/UI/Form';
import ManageEntity from 'components/Entity/ManageEntity';

const testModule = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const ManageBranchPage: React.FC = () => {
  const { id } = useParams();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { item: company } = useAppSelector(selectCompany);
  const countries = useAppSelector(selectSystemCountries);
  const { item: branch, updateError, fetchStatus } = useAppSelector(selectBranch);
  const [noPhysicalAddress, setNoPhysicalAddress] = React.useState<boolean | undefined>(undefined);
  const [fields, setFields] = React.useState<FormFieldProps<Branch>[]>([]);
  const formLoading = fetchStatus === 'loading' || (!branch && !!id) || fields.length === 0;
  const errors = isUserAdmin ? deepCopyObject(updateError?.errors) : USER_PERMISSION_GENERAL_MESSAGE;

  React.useEffect(() => {
    if (!id || (id && branch && noPhysicalAddress !== undefined)) {
      const availableCountries =
        countries?.filter(({ code }) => code === company?.countryCode || code === branch?.address?.countryCode) || [];
      const availableTimeZones = !branch?.timeZoneId
        ? companyTimeZones
        : companyTimeZones.some(({ id }) => id === branch.timeZoneId)
          ? companyTimeZones
          : [{ id: branch.timeZoneId, name: branch.timeZoneName } as TimeZone, ...companyTimeZones];
      const schema = getBranchManagementDetailsByAddressFormSchema(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, !!noPhysicalAddress);
      const disabledFields = mapDisabledFields(schema, userRoles);
      const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, availableTimeZones, availableCountries);

      setFields(mappedFields);
    }
  }, [id, branch, noPhysicalAddress, userRoles, companyTimeZones, countries, company?.countryCode, branch?.address?.countryCode]);

  const handleChange = (formValue: Branch) => {
    if (formValue.noPhysicalAddress !== noPhysicalAddress) {
      setNoPhysicalAddress(formValue.noPhysicalAddress);
    }
  };

  return (
    <ManageEntity<Branch, BranchDTO>
      module={testModule}
      subModule={testSubModule}
      pageTitle={{ create: 'Create Branch', edit: 'Edit Branch' }}
      fallbackRoute={ROUTES.branches.path}
      defaultValues={BRANCH_DETAILS_FORM_DEFAULT_VALUES}
      fields={fields}
      formSchema={BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA}
      formLoading={formLoading}
      errors={errors}
      extraFormProps={{ onChange: handleChange }}
      selectEntity={selectBranch}
      resetEntity={resetBranch}
      resetErrors={resetBranchErrors}
      resetCatalogFetchStatus={resetBranchesFetchStatus}
      fetchEntityAction={(params) => fetchBranchById({ id: params.id, skipState: false })}
      createEntityAction={createBranch}
      editEntityAction={editBranch}
      mapDTO={mapBranchDTO}
    />
  );
};

export default ManageBranchPage;
