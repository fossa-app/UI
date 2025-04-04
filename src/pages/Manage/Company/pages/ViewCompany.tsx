import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompany, selectCompany, selectCompanyLicense, selectUserRoles } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { COMPANY_LICENSE_VIEW_DETAILS_SCHEMA, COMPANY_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import { hasAllowedRole } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName } from 'components/UI/ViewDetails';
import Page, { PageSubtitle } from 'components/UI/Page';

const testModule = COMPANY_VIEW_DETAILS_SCHEMA.module;
const testSubModule = COMPANY_VIEW_DETAILS_SCHEMA.subModule;

const ViewCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: company, fetchStatus: companyFetchStatus } = useAppSelector(selectCompany);
  const { data: companyLicense, fetchStatus: companyLicenseFetchStatus } = useAppSelector(selectCompanyLicense);
  const userRoles = useAppSelector(selectUserRoles);
  const companyLoading = companyFetchStatus === 'idle' || companyFetchStatus === 'loading';

  const companyLicenseNoValuesTemplate = (
    <Page module={Module.companyManagement} subModule={SubModule.companyLicenseViewDetails} sx={{ margin: 0 }}>
      <PageSubtitle fontSize={20}>Company License has not been uploaded.</PageSubtitle>
    </Page>
  );

  const handleEdit = React.useCallback(() => {
    navigate(ROUTES.editCompany.path);
  }, [navigate]);

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
          <ViewDetails
            module={Module.companyManagement}
            subModule={SubModule.companyLicenseViewDetails}
            loading={companyLicenseFetchStatus === 'idle' || companyLicenseFetchStatus === 'loading'}
          >
            <ViewDetails.Header>{COMPANY_LICENSE_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
            <ViewDetails.Content
              fields={COMPANY_LICENSE_VIEW_DETAILS_SCHEMA.fields}
              values={companyLicense}
              noValuesTemplate={companyLicenseNoValuesTemplate}
            />
          </ViewDetails>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ViewCompanyPage;
