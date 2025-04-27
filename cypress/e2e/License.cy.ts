import { Module, SubModule } from 'shared/models';
import { ROUTES } from 'shared/constants';
import { getLinearLoader, getTestSelectorByModule, uploadTestFile, verifyTextFields } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchCompanyLicenseRequest,
  interceptUploadCompanyLicenseFailedRequest,
  interceptUploadCompanyLicenseRequest,
  interceptFetchCompanyLicenseFailedRequest,
} from '../support/interceptors';

describe('License Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
  });

  describe('Not Authenticated', () => {
    it('should fetch and display correct system license and not display company license if not logged in', () => {
      cy.visit('/login');

      cy.wait('@fetchSystemLicenseRequest');

      getTestSelectorByModule(Module.shared, SubModule.license, 'system-license').should('exist').and('have.text', 'TSL');

      getTestSelectorByModule(Module.shared, SubModule.license, 'system-license').trigger('mouseover');

      cy.get('.MuiTooltip-tooltip').should('exist').and('have.text', 'Test System Licensee');
      getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').should('not.exist');
      getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');
    });
  });

  describe('Authenticated', () => {
    describe('User Role', () => {
      beforeEach(() => {
        cy.loginMock();
      });

      it('should display a text with no action if the onboarding has completed and no company license is uploaded', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptFetchCompanyLicenseFailedRequest();
        interceptUploadCompanyLicenseFailedRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text')
          .should('exist')
          .and('have.text', 'Unlicensed Company');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').should('not.exist');

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').click();

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-dialog').should('not.exist');
      });
    });

    describe('Admin Role', () => {
      beforeEach(() => {
        cy.loginMock(true);
      });

      it('should not display default company license if the onboarding has not completed', () => {
        interceptUploadCompanyLicenseFailedRequest();
        cy.visit(ROUTES.onboarding.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').should('not.exist');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');
      });

      it('should display default company license if setup has completed', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptFetchCompanyLicenseFailedRequest();
        interceptUploadCompanyLicenseFailedRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button')
          .should('exist')
          .and('have.text', 'Unlicensed Company');
      });

      it('should not be able to upload a company license if a file is not selected or the uploading failed', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptFetchCompanyLicenseFailedRequest();
        interceptUploadCompanyLicenseFailedRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-dialog').should('not.exist');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').click();

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-dialog').should('be.visible');
        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-title').should('have.text', 'Upload License File');

        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-cancel-button').click();

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-dialog').should('not.exist');

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').click();
        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-upload-button').click();

        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-validation-message')
          .should('exist')
          .and('have.text', 'File is not selected');

        uploadTestFile('input#file-upload-input', 'invalid-company-license.lic');

        getTestSelectorByModule(Module.shared, SubModule.upload, 'file-upload-selected-file-name').should(
          'have.text',
          'invalid-company-license.lic'
        );

        interceptUploadCompanyLicenseFailedRequest();
        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-upload-button').click();

        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-upload-button')
          .find('[data-cy="loading-button-end-icon"]')
          .should('be.visible');

        cy.wait('@uploadCompanyLicenseFailedRequest').then(({ request }) => {
          cy.wrap(request.headers['content-type']).should('contain', 'multipart/form-data');
        });

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-dialog').should('exist');
        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
          .should('exist')
          .and('contain.text', 'Failed to upload Company license');
      });

      it('should be able to upload and display the company license if the selected file is valid and the uploading succeeded', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptFetchCompanyLicenseFailedRequest();
        interceptUploadCompanyLicenseFailedRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').click();
        uploadTestFile('input#file-upload-input', 'valid-company-license.lic');

        getTestSelectorByModule(Module.shared, SubModule.upload, 'file-upload-selected-file-name').should(
          'have.text',
          'valid-company-license.lic'
        );

        interceptUploadCompanyLicenseRequest();
        interceptFetchCompanyLicenseRequest();
        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-upload-button').click();

        getTestSelectorByModule(Module.shared, SubModule.license, 'dialog-upload-button')
          .find('[data-cy="loading-button-end-icon"]')
          .should('be.visible');

        cy.wait('@uploadCompanyLicenseRequest').then(({ request }) => {
          cy.wrap(request.headers['content-type']).should('contain', 'multipart/form-data');
        });

        getLinearLoader(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details').should('exist');

        cy.wait('@fetchCompanyLicenseRequest');

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-dialog').should('not.exist');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('exist').and('have.text', 'TCL');
        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
          .should('exist')
          .and('contain.text', 'Company License has been successfully uploaded');

        verifyTextFields(Module.companyManagement, SubModule.companyLicenseViewDetails, {
          'view-details-header': 'Company License Details',
          'view-details-section-terms': 'Terms',
          'view-details-section-entitlements': 'Entitlements',
          'view-details-label-terms.licensee.longName': 'Long Name',
          'view-details-value-terms.licensee.longName': 'Test Company Licensee',
          'view-details-label-terms.licensee.shortName': 'Short Name',
          'view-details-value-terms.licensee.shortName': 'TCL',
          'view-details-label-terms.notBefore': 'Valid From',
          'view-details-value-terms.notBefore': '9/1/2024',
          'view-details-label-terms.notAfter': 'Valid To',
          'view-details-value-terms.notAfter': '9/1/2025',
          'view-details-label-entitlements.maximumBranchCount': 'Maximum Branch Count',
          'view-details-value-entitlements.maximumBranchCount': '10',
          'view-details-label-entitlements.maximumEmployeeCount': 'Maximum Employee Count',
          'view-details-value-entitlements.maximumEmployeeCount': '100',
        });
      });

      it('should display correct company license in the footer', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptFetchCompanyLicenseRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').should('not.exist');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');

        cy.wait('@fetchCompanyLicenseRequest');

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-button').should('not.exist');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('exist').and('have.text', 'TCL');

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').trigger('mouseover');

        cy.get('.MuiTooltip-tooltip').should('exist').and('have.text', 'Test Company Licensee');
      });
    });
  });
});
