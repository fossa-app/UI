import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchCompanyLicenseRequest,
  interceptUploadCompanyLicenseFailedRequest,
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
    it('should not display default company license if setup has not completed', () => {
      interceptUploadCompanyLicenseFailedRequest();
      cy.loginMock();

      cy.visit('/setup');

      cy.get('[data-cy="company-license-button"]').should('not.exist');
      cy.get('[data-cy="company-license-text"]').should('not.exist');
    });

    it('should display default company license if setup has completed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();
      interceptUploadCompanyLicenseFailedRequest();
      cy.loginMock();

      cy.visit('/manage/dashboard');

      cy.get('[data-cy="company-license-button"]').should('exist').and('have.text', 'Unlicensed Company');
    });

    // TODO: add company license uploading tests

    it('should display correct company license', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();
      interceptFetchCompanyLicenseRequest();
      cy.loginMock();

      cy.visit('/manage/dashboard');

      cy.get('[data-cy="company-license-button"]').should('not.exist');
      cy.get('[data-cy="company-license-text"]').should('exist').and('have.text', 'Test Company Licensee');
    });
  });
});
