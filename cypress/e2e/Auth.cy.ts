import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'support/helpers';
import {
  interceptFetchClientFailedRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchTokenRequest,
  interceptLoginRequest,
  interceptLogoutRequest,
  interceptOpenidConfigurationRequest,
} from 'support/interceptors';

describe('Authentication Flow Tests - Failed Client Request', () => {
  beforeEach(() => {
    interceptFetchClientFailedRequest();
  });

  it('should render the Not Found page if the client was not found', () => {
    cy.visit('http://xxx.dev.localhost:4211');

    getTestSelectorByModule(Module.shared, SubModule.notFound, 'page').should('exist');
    getTestSelectorByModule(Module.shared, SubModule.notFound, 'page-title').should('exist').and('have.text', 'Page Not Found');
    getTestSelectorByModule(Module.shared, SubModule.notFound, 'page-subtitle')
      .should('exist')
      .and('have.text', 'The Client was not found');
  });
});

describe('Authentication Flow Tests - Successful Client Request', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('should render the Login page', () => {
    cy.visit(ROUTES.login.path);

    cy.get('[data-cy="login-form-title"]').should('exist').contains('Login');
    cy.get('[data-cy="login-button"]').should('exist').contains('Login');
    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-menu').should('not.exist');
  });

  it('should not be able to manually navigate to secured pages if not authenticated', () => {
    const securedRoutes = [
      ROUTES.createCompany.path,
      ROUTES.createBranch.path,
      ROUTES.createEmployee.path,
      ROUTES.company.path,
      ROUTES.branches.path,
      ROUTES.newBranch.path,
      `${ROUTES.branches.path}/edit/1`,
      ROUTES.employees.path,
    ];

    securedRoutes.forEach((route) => {
      cy.visit(route);
      cy.url().should('include', ROUTES.login.path);
    });
  });

  it('should navigate to FusionAuth authentication form with correct client after login', () => {
    interceptLoginRequest();
    interceptFetchCompanyFailedRequest();
    interceptOpenidConfigurationRequest();
    cy.visit(ROUTES.login.path);

    cy.wait('@fetchClientRequest');

    cy.get('[data-cy="login-button"]').click();

    cy.wait('@openidConfigurationRequest');
    cy.wait('@loginRequest');

    cy.url().should('include', 'http://localhost:9011/oauth2/authorize?client_id=PLACEHOLDER_CLIENT_ID');
  });

  it('should login successfully and display correct user name for user role', () => {
    interceptFetchTokenRequest();
    interceptOpenidConfigurationRequest();
    interceptFetchCompanyFailedRequest();
    cy.loginMock();
    cy.visit(ROUTES.flows.path);

    cy.location('pathname').should('eq', ROUTES.flows.path);
    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-menu').should('exist');
    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();

    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-name').should('exist').and('have.text', 'Hi, User');
  });

  it('should login successfully and display correct user name for admin role', () => {
    interceptFetchTokenRequest();
    interceptOpenidConfigurationRequest();
    interceptFetchCompanyFailedRequest();
    cy.loginMock(true);
    cy.visit(ROUTES.flows.path);

    cy.location('pathname').should('eq', ROUTES.flows.path);
    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();
    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-name').should('exist').and('have.text', 'Hi, Admin');
  });

  it('should logout successfully', () => {
    interceptFetchTokenRequest();
    interceptOpenidConfigurationRequest();
    interceptFetchCompanyFailedRequest();
    interceptLogoutRequest();
    cy.loginMock();
    cy.visit(ROUTES.flows.path);

    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();
    getTestSelectorByModule(Module.shared, SubModule.header, 'logout-button').click();

    cy.logoutMock();
    cy.wait('@openidConfigurationRequest');
    cy.wait('@logoutRequest');

    cy.url().should('include', ROUTES.login.path);
    getTestSelectorByModule(Module.shared, SubModule.header, 'profile-menu').should('not.exist');
  });

  // TODO: add test cases for auto-refresh and session expiration
});
