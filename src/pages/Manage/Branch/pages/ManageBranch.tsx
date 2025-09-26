import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
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
import { Branch, TimeZone } from 'shared/models';
import {
  getBranchManagementDetailsByAddressFormSchema,
  mapBranchDTO,
  mapDisabledFields,
  mapBranchFieldOptionsToFieldOptions,
  deepCopyObject,
  compareBigIds,
} from 'shared/helpers';
import { useOnFormSubmitEffect, useSafeNavigateBack } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormFieldProps, FormActionName } from 'components/UI/Form';

const testModule = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const ManageBranchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { item: company } = useAppSelector(selectCompany);
  const countries = useAppSelector(selectSystemCountries);
  const { item: branch, updateError, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectBranch);
  const safeNavigateBack = useSafeNavigateBack(ROUTES.branches.path);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [noPhysicalAddress, setNoPhysicalAddress] = React.useState<boolean | undefined>(undefined);
  const [fields, setFields] = React.useState<FormFieldProps<Branch>[]>([]);
  const formLoading = fetchStatus === 'loading' || (!branch && !!id) || fields.length === 0;
  const errors = isUserAdmin ? deepCopyObject(updateError?.errors) : USER_PERMISSION_GENERAL_MESSAGE;

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode || code === branch?.address?.countryCode) || [],
    [countries, company, branch]
  );

  const availableTimeZones = React.useMemo(() => {
    if (!branch?.timeZoneId) return companyTimeZones;
    const isTimeZoneAvailable = companyTimeZones.some(({ id }) => id === branch.timeZoneId);
    return isTimeZoneAvailable ? companyTimeZones : [{ id: branch.timeZoneId, name: branch.timeZoneName } as TimeZone, ...companyTimeZones];
  }, [companyTimeZones, branch]);

  const actions = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
    switch (action.name) {
      case FormActionName.cancel:
        return { ...action, onClick: safeNavigateBack };
      case FormActionName.submit:
        return { ...action, loading: updateStatus === 'loading' };
      default:
        return action;
    }
  });

  const updateFields = React.useCallback(() => {
    const schema = getBranchManagementDetailsByAddressFormSchema(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, !!noPhysicalAddress);
    const disabledFields = mapDisabledFields(schema, userRoles);
    const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, availableTimeZones, availableCountries);
    setFields(mappedFields);
  }, [noPhysicalAddress, userRoles, availableTimeZones, availableCountries]);

  React.useEffect(() => {
    if (!id || (id && branch && noPhysicalAddress !== undefined)) {
      updateFields();
    }
  }, [id, branch, noPhysicalAddress, updateFields]);

  React.useEffect(() => {
    if (id && (!branch || !compareBigIds(branch.id, id))) {
      dispatch(fetchBranchById({ id, skipState: false, shouldFetchBranchGeoAddress: false }));
    }
  }, [id, branch, dispatch]);

  React.useEffect(() => {
    if (!id) {
      dispatch(resetBranch());
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(resetBranchErrors());
    };
  }, [dispatch]);

  const handleSuccess = () => {
    safeNavigateBack();
    dispatch(resetBranchesFetchStatus());
    dispatch(resetBranch());
  };

  const handleSubmit = (formValue: Branch) => {
    const submitData = mapBranchDTO(formValue);

    if (id) {
      dispatch(editBranch([id, submitData]));
    } else {
      dispatch(createBranch(submitData));
    }

    setFormSubmitted(true);
  };

  const handleChange = (formValue: Branch) => {
    if (formValue.noPhysicalAddress !== noPhysicalAddress) {
      setNoPhysicalAddress(formValue.noPhysicalAddress);
    }
  };

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      fallbackRoute={ROUTES.branches.path}
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
    >
      <Form<Branch>
        module={testModule}
        subModule={testSubModule}
        defaultValues={BRANCH_DETAILS_FORM_DEFAULT_VALUES}
        values={branch}
        errors={errors}
        loading={formLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <Form.Header>{BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.title}</Form.Header>
        <Form.Content fields={fields} />
        <Form.Actions actions={actions}></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default ManageBranchPage;
