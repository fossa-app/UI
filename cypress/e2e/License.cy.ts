import { getCompanyLicenseDialogElement, uploadTestFile } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
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

      cy.get('[data-cy="system-license"]').should('exist').and('have.text', 'Unlicensed System');

      cy.wait('@fetchSystemLicenseRequest');

      cy.get('[data-cy="system-license"]').should('exist').and('have.text', 'Test System Licensee');
      cy.get('[data-cy="company-license-button"]').should('not.exist');
      cy.get('[data-cy="company-license-text"]').should('not.exist');
    });
  });

  describe('Authenticated', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should not display default company license if setup has not completed', () => {
      interceptUploadCompanyLicenseFailedRequest();

      cy.visit('/setup');

      cy.get('[data-cy="company-license-button"]').should('not.exist');
      cy.get('[data-cy="company-license-text"]').should('not.exist');
    });

    it('should display default company license if setup has completed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptUploadCompanyLicenseFailedRequest();

      cy.visit('/manage/dashboard');

      cy.get('[data-cy="company-license-button"]').should('exist').and('have.text', 'Unlicensed Company');
    });

    it('should not be able to upload a company license if a file is not selected or the uploading failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptUploadCompanyLicenseFailedRequest();
      cy.visit('/manage/dashboard');

      cy.get('[data-cy="company-license-dialog"]').should('not.exist');
      cy.get('[data-cy="company-license-button"]').click();

      cy.get('[data-cy="company-license-dialog"]').should('be.visible');
      getCompanyLicenseDialogElement('dialog-title').should('have.text', 'Upload License File');

      getCompanyLicenseDialogElement('dialog-cancel-button').click();

      cy.get('[data-cy="company-license-dialog"]').should('not.exist');

      cy.get('[data-cy="company-license-button"]').click();
      getCompanyLicenseDialogElement('dialog-upload-button').click();

      getCompanyLicenseDialogElement('dialog-validation-message').should('exist').and('have.text', 'File is not selected');

      uploadTestFile('input#file-upload-input', 'invalid-company-license.lic');

      cy.get('[data-cy="selected-file-name"]').should('have.text', 'invalid-company-license.lic');

      interceptUploadCompanyLicenseFailedRequest();
      getCompanyLicenseDialogElement('dialog-upload-button').click();

      getCompanyLicenseDialogElement('dialog-upload-button').find('[data-cy="loading-button-end-icon"]').should('be.visible');

      cy.wait('@uploadCompanyLicenseFailedRequest').then(({ request }) => {
        expect(request.headers['content-type']).to.include('multipart/form-data');
      });

      cy.get('[data-cy="company-license-dialog"]').should('exist');
      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to upload Company license');
    });

    it('should be able to upload a company license if the selected file is valid and the uploading succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptUploadCompanyLicenseFailedRequest();
      cy.visit('/manage/dashboard');

      cy.get('[data-cy="company-license-button"]').click();
      uploadTestFile('input#file-upload-input', 'valid-company-license.lic');

      cy.get('[data-cy="selected-file-name"]').should('have.text', 'valid-company-license.lic');

      interceptUploadCompanyLicenseRequest();
      interceptFetchCompanyLicenseRequest();
      getCompanyLicenseDialogElement('dialog-upload-button').click();

      getCompanyLicenseDialogElement('dialog-upload-button').find('[data-cy="loading-button-end-icon"]').should('be.visible');

      cy.wait('@uploadCompanyLicenseRequest').then(({ request }) => {
        expect(request.headers['content-type']).to.include('multipart/form-data');
      });

      cy.wait('@fetchCompanyLicenseRequest');

      cy.get('[data-cy="company-license-dialog"]').should('not.exist');
    });

    it('should display correct company license', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();
      interceptFetchCompanyLicenseRequest();

      cy.visit('/manage/dashboard');

      cy.get('[data-cy="company-license-button"]').should('not.exist');
      cy.get('[data-cy="company-license-text"]').should('exist').and('have.text', 'Test Company Licensee');
    });
  });
});
