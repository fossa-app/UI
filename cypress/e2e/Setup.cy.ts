import { Module, SubModule } from '../../src/shared/models';
import { getTestSelectorByModule } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchBranchesFailedRequest,
  interceptFetchEmployeeFailedRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchEmployeeRequest,
  interceptCreateCompanyFailedRequest,
  interceptCreateCompanyRequest,
  interceptCreateBranchFailedRequest,
  interceptCreateBranchRequest,
  interceptCreateEmployeeFailedRequest,
  interceptCreateEmployeeRequest,
} from '../support/interceptors';

const setupRoutes = ['/setup/company', '/setup/branch', '/setup/employee'];

describe('Setup Flow Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
    });

    it('should navigate to company setup page and no other setup page if there is no company', () => {
      interceptFetchCompanyFailedRequest();

      cy.visit('/setup/company');
      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
      cy.get('[data-cy="setup-next-button"]').should('have.attr', 'disabled');
      cy.get('[data-cy="company-branch-input-validation"]')
        .should('exist')
        .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/company');
      });
    });

    it('should navigate to branch setup page and no other setup page if company exists', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();

      cy.visit('/setup/branch');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').should('have.attr', 'disabled');
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-general-validation-message')
        .should('exist')
        .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/branch');
      });
    });

    it('should navigate to employee setup page and no other setup page if company and branch exist', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();

      cy.visit('/setup/employee');
      cy.wait('@fetchCompanyRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');
      cy.get('[data-cy="setup-finish-button"]').should('not.have.attr', 'disabled');
      cy.get('[data-cy="company-branch-input-validation"]').should('not.exist');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/employee');
      });
    });

    it('should not be able to navigate to dashboard if employee creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();
      interceptCreateEmployeeFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');

      cy.get('[data-cy="setup-finish-button"]').click();

      cy.wait('@createEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');
    });

    it('should be able to navigate to dashboard if employee creation succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();
      interceptCreateEmployeeRequest();
      cy.visit('/setup');

      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');

      cy.get('[data-cy="employee-firstname-input"] input').clear();
      cy.get('[data-cy="employee-firstname-input"] input').type('Anthony');
      cy.get('[data-cy="employee-lastname-input"] input').clear();
      cy.get('[data-cy="employee-lastname-input"] input').type('Crowley');
      cy.get('[data-cy="employee-fullname-input"] input').clear();
      cy.get('[data-cy="employee-fullname-input"] input').type('Anthony User Crowley');

      interceptFetchEmployeeRequest();
      cy.get('[data-cy="setup-finish-button"]').click();

      cy.wait('@createEmployeeRequest');
      cy.wait('@fetchEmployeeRequest');

      cy.url().should('include', '/manage/dashboard');
    });

    it('should navigate to dashboard if company, branch and employee data exist', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();

      cy.visit('/setup');
      cy.wait('@fetchCompanyRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchEmployeeRequest');

      cy.url().should('include', '/manage/dashboard');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should navigate to company setup page and no other setup page if there is no company', () => {
      interceptFetchCompanyFailedRequest();

      cy.visit('/setup/company');
      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
      cy.get('[data-cy="setup-next-button"]').should('not.have.attr', 'disabled');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/company');
      });
    });

    it('should navigate to branch setup page and no other setup page if company exists', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();

      cy.visit('/setup/branch');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').should('not.have.attr', 'disabled');
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-general-validation-message').should('not.exist');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/branch');
      });
    });

    it('should navigate to employee setup page and no other setup page if company and branch exist', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();

      cy.visit('/setup/employee');
      cy.wait('@fetchCompanyRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');
      cy.get('[data-cy="setup-finish-button"]').should('not.have.attr', 'disabled');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/employee');
      });
    });

    it('should navigate to dashboard if company, branch and employee data exist', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeRequest();

      cy.visit('/setup');
      cy.wait('@fetchCompanyRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchEmployeeRequest');

      cy.url().should('include', '/manage/dashboard');
    });

    it('should not be able to navigate to branch setup step if company creation failed', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');

      cy.get('[data-cy="company-branch-input"]').type('Test Company');
      cy.get('[data-cy="setup-next-button"]').click();

      cy.wait('@createCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
    });

    it('should be able to navigate to branch setup step if company creation succeeded', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyRequest();
      interceptFetchBranchesFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
      cy.get('[data-cy="company-logo"]').should('not.exist');

      interceptFetchCompanyRequest();

      cy.get('[data-cy="company-branch-input"]').type('Good Omens');
      cy.get('[data-cy="setup-next-button"]').click();

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      cy.get('[data-cy="company-logo"]').should('exist').and('have.text', 'Good Omens');
    });

    it('should not be able to navigate to employee setup step if branch creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', '/setup/branch');

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('Test Branch');
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').click();

      cy.wait('@createBranchFailedRequest');

      cy.url().should('include', '/setup/branch');
    });

    it('should be able to navigate to employee setup step if branch creation succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchRequest();
      interceptFetchEmployeeFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', '/setup/branch');

      interceptFetchBranchesRequest();

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('London');
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').click();

      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.url().should('include', '/setup/employee');
      cy.get('[data-cy="employee-firstname-input"] input').should('have.value', 'Admin');
      cy.get('[data-cy="employee-lastname-input"] input').should('have.value', 'Mock');
      cy.get('[data-cy="employee-fullname-input"] input').should('have.value', 'Admin Oidc Mock');
    });

    it('should not be able to navigate to dashboard if employee creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();
      interceptCreateEmployeeFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');

      cy.get('[data-cy="setup-finish-button"]').click();

      cy.wait('@createEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');
    });

    it('should be able to navigate to dashboard if employee creation succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();
      interceptCreateEmployeeRequest();
      cy.visit('/setup');

      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');

      cy.get('[data-cy="employee-firstname-input"] input').clear();
      cy.get('[data-cy="employee-firstname-input"] input').type('Gabriel');
      cy.get('[data-cy="employee-lastname-input"] input').clear();
      cy.get('[data-cy="employee-lastname-input"] input').type('Archangel');
      cy.get('[data-cy="employee-fullname-input"] input').clear();
      cy.get('[data-cy="employee-fullname-input"] input').type('Gabriel Admin Archangel');

      interceptFetchEmployeeRequest();
      cy.get('[data-cy="setup-finish-button"]').click();

      cy.wait('@createEmployeeRequest');
      cy.wait('@fetchEmployeeRequest');

      cy.url().should('include', '/manage/dashboard');
    });
  });
});
