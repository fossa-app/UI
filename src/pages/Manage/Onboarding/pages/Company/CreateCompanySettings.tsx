import React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectUserRoles,
  selectCompanySettings,
  selectAppConfig,
  selectIsUserAdmin,
  setPreviewCompanyColorSchemeSettings,
  resetPreviewCompanyColorSchemeSettings,
} from 'store/features';
import { createCompanySettings } from 'store/thunks';
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
  const filteredSchemes = Object.fromEntries(Object.entries(COLOR_SCHEMES).filter(([, scheme]) => scheme[mode]));
  const errors = isUserAdmin ? deepCopyObject(error?.errors) : USER_PERMISSION_GENERAL_MESSAGE;

  const fields = mapDisabledFields(CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.fields, userRoles).map((field) => {
    if (field.name === COMPANY_SETTINGS_FIELDS.colorSchemeId!.field) {
      return {
        ...field,
        mode,
        colorSchemes: filteredSchemes,
      };
    }
    return field;
  });

  const actions = CREATE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.actions.map((action) =>
    action.name === FormActionName.submit
      ? { ...action, disabled: !hasAllowedRole(action.roles, userRoles), loading: updateStatus === 'loading' }
      : action
  );

  useUnmount(() => {
    dispatch(resetPreviewCompanyColorSchemeSettings());
  });

  const handleSubmit = (data: EntityInput<CompanySettingsDTO>) => {
    dispatch(createCompanySettings(data));
  };

  const handleChange = (data: EntityInput<CompanySettingsDTO>) => {
    const { colorSchemeId } = data;
    if (colorSchemeId) {
      dispatch(setPreviewCompanyColorSchemeSettings(colorSchemeId));
    }
  };

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
