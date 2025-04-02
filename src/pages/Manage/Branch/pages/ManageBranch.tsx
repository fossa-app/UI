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
import { BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, MESSAGES, ROUTES } from 'shared/constants';
import { Branch, TimeZone } from 'shared/models';
import {
  getBranchManagementDetailsByAddressFormSchema,
  mapBranchDTO,
  mapDisabledFields,
  mapBranchFieldOptionsToFieldOptions,
  deepCopyObject,
} from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FieldProps, FormActionName } from 'components/UI/Form';

const testModule = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

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

  const defaultValues: Branch = {
    name: '',
    timeZoneId: '',
    address: null,
  };

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

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const handleCancel = React.useCallback(() => {
    dispatch(resetBranch());
    navigate(ROUTES.branches.path);
  }, [navigate, dispatch]);

  const actions = React.useMemo(
    () =>
      BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
        switch (action.name) {
          case FormActionName.cancel:
            return { ...action, onClick: handleCancel };
          case FormActionName.submit:
            return { ...action, loading: updateStatus === 'loading' };
          default:
            return action;
        }
      }),
    [updateStatus, handleCancel]
  );

  const updateFields = React.useCallback(() => {
    const schema = getBranchManagementDetailsByAddressFormSchema(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, !!noPhysicalAddress);
    const disabledFields = mapDisabledFields(schema, userRoles);
    const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, availableTimeZones, availableCountries);

    setFields(mappedFields);
    setFormLoading(!mappedFields.length);
  }, [noPhysicalAddress, userRoles, availableCountries, availableTimeZones]);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById({ id, skipState: false }));
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

  return (
    <PageLayout
      withBackButton
      module={testModule}
      subModule={testSubModule}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={handleCancel}
    >
      <Form<Branch>
        module={testModule}
        subModule={testSubModule}
        defaultValues={defaultValues}
        values={branch}
        errors={errors}
        loading={formLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <Form.Header>{BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA.title}</Form.Header>

        <Form.Content fields={fields} />

        <Form.Actions
          actions={actions}
          generalValidationMessage={isUserAdmin ? undefined : MESSAGES.error.general.permission}
        ></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default ManageBranchPage;
