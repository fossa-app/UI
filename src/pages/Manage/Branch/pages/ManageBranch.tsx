import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createBranch,
  editBranch,
  fetchBranchById,
  resetBranch,
  resetBranchesFetchStatus,
  selectBranch,
  selectIsUserAdmin,
  selectCompanyTimeZones,
  selectUserRoles,
  selectCompany,
  selectSystemCountries,
} from 'store/features';
import { BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { Branch, Module, SubModule, TimeZone } from 'shared/models';
import {
  getBranchManagementDetailsByAddressFormSchema,
  mapBranchDTO,
  mapDisabledFields,
  mapBranchFieldOptionsToFieldOptions,
  deepCopyObject,
} from 'shared/helpers';
import BranchDetailsForm from 'components/forms/BranchDetailsForm';
import PageLayout from 'components/layouts/PageLayout';
import { FieldProps } from 'components/UI/Form';

const testModule = Module.branchManagement;
const testSubModule = SubModule.branchDetails;

const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { data: company } = useAppSelector(selectCompany);
  const countries = useAppSelector(selectSystemCountries);
  const { data: branch, error, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [noPhysicalAddress, setNoPhysicalAddress] = React.useState<boolean | undefined>(undefined);
  const [fields, setFields] = React.useState<FieldProps<Branch>[]>([]);
  const [formLoading, setFormLoading] = React.useState(true);
  // TODO: this is a workaround for the issue mentioned in InputField
  // Need to remove the 'Address' validation error from the backend
  const errors = error?.errors ? deepCopyObject(error.errors as FieldErrors<FieldValues>) : undefined;

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode || code === branch?.address?.countryCode) || [],
    [countries, company, branch]
  );

  const availableTimeZones = React.useMemo(() => {
    const isTimeZoneAvailable = companyTimeZones.some(({ id }) => id === branch?.timeZoneId);

    if (isTimeZoneAvailable || (!branch?.timeZoneId && !branch?.timeZoneName)) {
      return companyTimeZones;
    }

    return [{ id: branch.timeZoneId, name: branch.timeZoneName } as TimeZone, ...companyTimeZones];
  }, [companyTimeZones, branch]);

  const updateFields = React.useCallback(() => {
    const schema = getBranchManagementDetailsByAddressFormSchema(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, !!noPhysicalAddress);
    const disabledFields = mapDisabledFields(schema, userRoles);
    const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, availableTimeZones, availableCountries);

    setFields(mappedFields);
    setFormLoading(!mappedFields.length);
  }, [noPhysicalAddress, userRoles, availableCountries, availableTimeZones]);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    } else {
      dispatch(resetBranch());
    }
  }, [id, dispatch]);

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetBranch());
      navigate(ROUTES.branches.path);
    }
  }, [updateStatus, formSubmitted, navigate, dispatch]);

  React.useEffect(() => {
    if (!id || (id && branch && noPhysicalAddress !== undefined)) {
      updateFields();
    }
  }, [id, branch, noPhysicalAddress, updateFields]);

  React.useEffect(() => {
    return () => {
      if (formSubmitted) {
        dispatch(resetBranchesFetchStatus());
      }
    };
  }, [formSubmitted, dispatch]);

  const handleSubmit = (formValue: Branch) => {
    const submitData = mapBranchDTO(formValue);

    if (id) {
      dispatch(editBranch([id, submitData]));
    } else {
      dispatch(createBranch([submitData, false]));
    }

    setFormSubmitted(true);
  };

  const handleChange = (formValue: Branch) => {
    if (formValue.noPhysicalAddress !== noPhysicalAddress) {
      setNoPhysicalAddress(formValue.noPhysicalAddress);
    }
  };

  const handleCancel = () => {
    dispatch(resetBranch());
    navigate(ROUTES.branches.path);
  };

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={handleCancel}
    >
      <BranchDetailsForm
        withCancel
        module={testModule}
        subModule={testSubModule}
        isAdmin={isUserAdmin}
        data={branch}
        errors={errors}
        fields={fields}
        actionLoading={updateStatus === 'loading'}
        formLoading={formLoading}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default ManageBranchPage;
