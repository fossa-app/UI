import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompany, selectCompany, selectCompanyLicense, selectIsUserAdmin } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { COMPANY_LICENSE_VIEW_DETAILS_SCHEMA, COMPANY_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';
import Page, { PageSubtitle } from 'components/UI/Page';

const ViewCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: company, fetchStatus: companyFetchStatus } = useAppSelector(selectCompany);
  const { data: companyLicense, fetchStatus: companyLicenseFetchStatus } = useAppSelector(selectCompanyLicense);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const companyLicenseNoValuesTemplate = (
    <Page module={Module.companyManagement} subModule={SubModule.companyLicenseViewDetails} sx={{ margin: 0 }}>
      <PageSubtitle fontSize={20}>Company License has not been uploaded.</PageSubtitle>
    </Page>
  );

  const handleEditClick = () => {
    navigate(ROUTES.editCompany.path);
  };

  React.useEffect(() => {
    if (companyFetchStatus === 'idle') {
      dispatch(fetchCompany());
    }
  }, [companyFetchStatus, dispatch]);

  return (
    <PageLayout module={Module.companyManagement} subModule={SubModule.companyViewDetails} pageTitle="View Company">
      <Grid container spacing={5}>
        <Grid size={12}>
          <ViewDetails
            module={Module.companyManagement}
            subModule={SubModule.companyViewDetails}
            loading={companyFetchStatus === 'loading'}
          >
            <ViewDetails.Header>Company Details</ViewDetails.Header>
            <ViewDetails.Content fields={COMPANY_VIEW_DETAILS_SCHEMA} values={company} />
            <ViewDetails.Actions>
              {isUserAdmin && (
                <Button
                  data-cy={`${Module.companyManagement}-${SubModule.companyViewDetails}-view-action-button`}
                  aria-label="Edit Company Button"
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              )}
            </ViewDetails.Actions>
          </ViewDetails>
        </Grid>
        <Grid size={12}>
          <ViewDetails
            module={Module.companyManagement}
            subModule={SubModule.companyLicenseViewDetails}
            loading={companyLicenseFetchStatus === 'loading'}
          >
            <ViewDetails.Header>Company License Details</ViewDetails.Header>
            <ViewDetails.Content
              fields={COMPANY_LICENSE_VIEW_DETAILS_SCHEMA}
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
