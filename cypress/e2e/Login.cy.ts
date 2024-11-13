import {
  interceptFetchClientRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchTokenRequest,
  interceptLoginRequest,
} from '../support/interceptors';

describe('Login Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
  });

  it('should render the Login page', () => {
    cy.visit('/login');

    cy.get('[data-cy="login-form-title"]').should('exist').contains('Login');
    cy.get('[data-cy="login-button"]').should('exist').contains('Login');
    cy.get('[data-cy="user-menu"]').should('not.exist');
  });

  it('should not be able to manually navigate to secured pages if not authenticated', () => {
    const securedRoutes = [
      '/setup/company',
      '/setup/branch',
      '/setup/employee',
      '/manage/dashboard',
      '/manage/company',
      '/manage/branches',
      '/manage/branches/new',
      '/manage/branches/edit/1',
      '/manage/employees',
    ];

    securedRoutes.forEach((route) => {
      cy.visit(route);
      cy.url().should('include', '/login');
    });
  });

  it('should navigate to FusionAuth authentication form with correct client after login', () => {
    cy.visit('/login');
    interceptLoginRequest();

    cy.wait('@fetchClientRequest');

    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginRequest');

    cy.url().should('include', 'http://localhost:9011/oauth2/authorize?client_id=mock-client-id');
  });

  it('should login successfully and display correct user name', () => {
    interceptFetchTokenRequest();
    interceptFetchCompanyFailedRequest();
    cy.loginMock();

    cy.visit('/setup');

    cy.url().should('include', '/setup');
    cy.get('[data-cy="user-menu"]').should('exist');
    cy.get('[data-cy="user-avatar"]').click();
    cy.get('[data-cy="user-name"]').should('exist').and('have.text', 'Hi, Mock');
  });
});
