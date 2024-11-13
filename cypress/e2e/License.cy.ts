import { interceptFetchClientRequest, interceptFetchSystemLicenseRequest } from '../support/interceptors';

describe('License Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
  });

  it('should fetch and display correct system license', () => {
    cy.visit('/login');

    cy.get('[data-cy="system-license"]').should('exist').and('have.text', 'Unlicensed System');

    cy.wait('@fetchSystemLicenseRequest');

    cy.get('[data-cy="system-license"]').should('exist').and('have.text', 'Test System Licensee');
  });

  it('should not display company license if not logged in', () => {
    cy.visit('/login');

    cy.get('[data-cy="company-license-button"]').should('not.exist');
    cy.get('[data-cy="company-license-text"]').should('not.exist');
  });
});
