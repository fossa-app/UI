import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import {
  fetchCompany,
  fetchCompanyDatasourceTotals,
  selectCompany,
  selectBranchUsagePercent,
  selectCompanyLicense,
  selectUserRoles,
  selectEmployeeUsagePercent,
  selectDepartmentUsagePercent,
  selectCompanyDatasourceTotals,
  selectCompanyLicenseLoading,
} from 'store/features';
import { Module, SubModule } from 'shared/models';
import { COMPANY_LICENSE_VIEW_DETAILS_SCHEMA, COMPANY_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import { createCompanyLicenseEntitlementsFieldsMap, hasAllowedRole } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName } from 'components/UI/ViewDetails';
import Page from 'components/UI/Page';
import { renderLicenseUsageDetail } from 'pages/Manage/Branch/helpers/renderLicenseUsageDetail';

const testModule = COMPANY_VIEW_DETAILS_SCHEMA.module;
const testSubModule = COMPANY_VIEW_DETAILS_SCHEMA.subModule;

const ViewCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: company, fetchStatus: companyFetchStatus } = useAppSelector(selectCompany);
  const { data: companyLicense } = useAppSelector(selectCompanyLicense);
  const userRoles = useAppSelector(selectUserRoles);
  const { branches, employees, departments } = useAppSelector(selectCompanyDatasourceTotals);
  const branchUsagePercent = useAppSelector(selectBranchUsagePercent);
  const employeeUsagePercent = useAppSelector(selectEmployeeUsagePercent);
  const departmentUsagePercent = useAppSelector(selectDepartmentUsagePercent);
  const companyLicenseLoading = useAppSelector(selectCompanyLicenseLoading);
  const { maximumBranchCount, maximumEmployeeCount, maximumDepartmentCount } = companyLicense?.entitlements || {};
  const companyLoading = companyFetchStatus === 'idle' || companyFetchStatus === 'loading';

  const companyLicenseNoValuesTemplate = (
    <Page module={Module.companyManagement} subModule={SubModule.companyLicenseViewDetails} sx={{ margin: 0 }}>
      <Page.Title typographyProps={{ variant: 'h6' }}>Company License has not been uploaded.</Page.Title>
      <Page.Subtitle>Please go to the Company Onboarding and upload the License.</Page.Subtitle>
    </Page>
  );

  const handleEdit = React.useCallback(() => {
    navigate(ROUTES.editCompany.path);
  }, [navigate]);

  const companyLicenseEntitlementsFieldsMap = React.useMemo(
    () =>
      createCompanyLicenseEntitlementsFieldsMap({
        branches,
        maximumBranchCount,
        branchUsagePercent,
        employees,
        maximumEmployeeCount,
        employeeUsagePercent,
        departments,
        maximumDepartmentCount,
        departmentUsagePercent,
      }),
    [
      branches,
      maximumBranchCount,
      branchUsagePercent,
      employees,
      maximumEmployeeCount,
      employeeUsagePercent,
      departments,
      maximumDepartmentCount,
      departmentUsagePercent,
    ]
  );

  const companyLicenseFields = React.useMemo(() => {
    return COMPANY_LICENSE_VIEW_DETAILS_SCHEMA.fields.map((field) => {
      const companyLicenseEntitlementsField = companyLicenseEntitlementsFieldsMap[field.name];

      if (companyLicenseEntitlementsField) {
        return {
          ...field,
          type: undefined,
          renderDetailField: () =>
            renderLicenseUsageDetail({
              module: COMPANY_LICENSE_VIEW_DETAILS_SCHEMA.module,
              subModule: COMPANY_LICENSE_VIEW_DETAILS_SCHEMA.subModule,
              field: companyLicenseEntitlementsField.field,
              label: `${companyLicenseEntitlementsField.labelPrefix}: ${companyLicenseEntitlementsField.usage} of ${companyLicenseEntitlementsField.max}`,
              value: companyLicenseEntitlementsField.value,
            }),
        };
      }

      return field;
    });
  }, [companyLicenseEntitlementsFieldsMap]);

  const actions = React.useMemo(
    () =>
      COMPANY_VIEW_DETAILS_SCHEMA.actions
        ?.filter(({ roles }) => hasAllowedRole(roles, userRoles))
        .map((action) => {
          switch (action.name) {
            case ViewDetailActionName.edit:
              return { ...action, onClick: handleEdit };
            default:
              return action;
          }
        }),
    [userRoles, handleEdit]
  );

  React.useEffect(() => {
    if (companyFetchStatus === 'idle') {
      dispatch(fetchCompany());
    }
  }, [companyFetchStatus, dispatch]);

  React.useEffect(() => {
    dispatch(fetchCompanyDatasourceTotals());
  }, [dispatch]);

  return (
    <PageLayout module={testModule} subModule={testSubModule} pageTitle="View Company">
      <Grid container spacing={5}>
        <Grid size={12}>
          <ViewDetails module={testModule} subModule={testSubModule} loading={companyLoading}>
            <ViewDetails.Header>{COMPANY_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
            <ViewDetails.Content fields={COMPANY_VIEW_DETAILS_SCHEMA.fields} values={company} />
            <ViewDetails.Actions actions={actions!}></ViewDetails.Actions>
          </ViewDetails>
        </Grid>
        <Grid size={12}>
          <ViewDetails module={Module.companyManagement} subModule={SubModule.companyLicenseViewDetails} loading={companyLicenseLoading}>
            <ViewDetails.Header>{COMPANY_LICENSE_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
            <ViewDetails.Content fields={companyLicenseFields} values={companyLicense} noValuesTemplate={companyLicenseNoValuesTemplate} />
          </ViewDetails>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ViewCompanyPage;
