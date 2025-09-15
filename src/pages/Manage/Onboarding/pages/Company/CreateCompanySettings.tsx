import * as React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectUserRoles,
  selectCompanySettings,
  selectAppConfig,
  createCompanySettings,
  selectIsUserAdmin,
  setPreviewCompanyColorSchemeSettings,
  resetPreviewCompanyColorSchemeSettings,
} from 'store/features';
import {
  DEFAULT_COMPANY_SETTINGS,
  COMPANY_SETTINGS_FIELDS,
  CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA,
  USER_PERMISSION_GENERAL_MESSAGE,
} from 'shared/constants';
import { CompanySettings, CompanySettingsDTO, EntityInput, ThemeMode } from 'shared/models';
import { deepCopyObject, hasAllowedRole, mapDisabledFields } from 'shared/helpers';
import { COLOR_SCHEMES } from 'shared/themes';
import { useUnmount } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.module;
const testSubModule = CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.subModule;

const CreateCompanySettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const { updateStatus, updateError: error } = useAppSelector(selectCompanySettings);
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const mode: ThemeMode = isDarkTheme ? 'dark' : 'light';

  const handleSubmit = React.useCallback(
    (data: EntityInput<CompanySettingsDTO>) => {
      dispatch(createCompanySettings(data));
    },
    [dispatch]
  );

  const handleChange = (data: EntityInput<CompanySettingsDTO>) => {
    const { colorSchemeId } = data;

    if (colorSchemeId) {
      dispatch(setPreviewCompanyColorSchemeSettings(colorSchemeId));
    }
  };

  const filteredSchemes = React.useMemo(() => {
    return Object.fromEntries(Object.entries(COLOR_SCHEMES).filter(([, scheme]) => scheme[mode]));
  }, [mode]);

  const fields = React.useMemo(() => {
    const mappedFields = mapDisabledFields(CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.fields, userRoles);

    return mappedFields.map((field) => {
      if (field.name === COMPANY_SETTINGS_FIELDS.colorSchemeId!.field) {
        return {
          ...field,
          mode,
          colorSchemes: filteredSchemes,
        };
      }

      return field;
    });
  }, [userRoles, filteredSchemes, mode]);

  const actions = React.useMemo(
    () =>
      CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.actions.map((action) =>
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

  useUnmount(() => {
    dispatch(resetPreviewCompanyColorSchemeSettings());
  });

  return (
    <PageLayout module={testModule} subModule={testSubModule} pageTitle="Company Settings">
      <Form<CompanySettings>
        module={testModule}
        subModule={testSubModule}
        defaultValues={DEFAULT_COMPANY_SETTINGS}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <Form.Header>{CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.title}</Form.Header>
        <Form.Content fields={fields} />
        <Form.Actions actions={actions} />
      </Form>
    </PageLayout>
  );
};

export default CreateCompanySettingsPage;
