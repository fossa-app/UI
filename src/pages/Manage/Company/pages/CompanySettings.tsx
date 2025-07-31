import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectUserRoles,
  selectCompanySettings,
  editCompanySettings,
  selectAppConfig,
  setPreviewCompanyColorSchemeSettings,
  resetPreviewCompanyColorSchemeSettings,
} from 'store/features';
import { COMPANY_SETTINGS_FIELDS, COMPANY_SETTINGS_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { CompanySettings, CompanySettingsDTO, ThemeMode } from 'shared/models';
import { mapDisabledFields } from 'shared/helpers';
import { COLOR_SCHEMES } from 'shared/themes';
import { useUnmount } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';
import CompanySettingsRouteGuard from 'routes/guards/CompanySettingsRouteGuard';

const testModule = COMPANY_SETTINGS_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = COMPANY_SETTINGS_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const CompanySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const { data: companySettings, fetchStatus, updateStatus } = useAppSelector(selectCompanySettings);
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const mode: ThemeMode = isDarkTheme ? 'dark' : 'light';

  const handleSubmit = React.useCallback(
    (data: Omit<CompanySettingsDTO, 'id'>) => {
      dispatch(editCompanySettings({ ...companySettings, ...data }));
    },
    [companySettings, dispatch]
  );

  const handleChange = React.useCallback(
    (data: CompanySettingsDTO) => {
      if (data.colorSchemeId) {
        dispatch(setPreviewCompanyColorSchemeSettings(data.colorSchemeId));
      }
    },
    [dispatch]
  );

  const handleCancel = React.useCallback(() => {
    navigate(ROUTES.flows.path);
  }, [navigate]);

  const filteredSchemes = React.useMemo(() => {
    return Object.fromEntries(Object.entries(COLOR_SCHEMES).filter(([, scheme]) => scheme[mode]));
  }, [mode]);

  const fields = React.useMemo(() => {
    const mappedFields = mapDisabledFields(COMPANY_SETTINGS_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, userRoles);

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
      COMPANY_SETTINGS_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
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

  useUnmount(() => {
    dispatch(resetPreviewCompanyColorSchemeSettings());
  });

  return (
    <CompanySettingsRouteGuard>
      <PageLayout module={testModule} subModule={testSubModule} pageTitle="Company Settings">
        <Form<CompanySettings>
          module={testModule}
          subModule={testSubModule}
          values={companySettings}
          loading={fetchStatus === 'loading'}
          onChange={handleChange}
          onSubmit={handleSubmit}
        >
          <Form.Header>{COMPANY_SETTINGS_MANAGEMENT_DETAILS_FORM_SCHEMA.title}</Form.Header>

          <Form.Content fields={fields} />

          <Form.Actions actions={actions} />
        </Form>
      </PageLayout>
    </CompanySettingsRouteGuard>
  );
};

export default CompanySettingsPage;
