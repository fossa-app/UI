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
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-general-validation-message')
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
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').should('not.have.attr', 'disabled');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-general-validation-message').should('not.exist');

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

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').click();

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

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').type('Anthony');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').type('Crowley');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName')
        .find('input')
        .type('Anthony User Crowley');

      interceptFetchEmployeeRequest();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').click();

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
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');

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
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').should('not.have.attr', 'disabled');

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

    it('should display validation messages if the company creation form is invalid', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchCompanyFailedRequest');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'Company Name is required');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type(
        'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long company name'
      );

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'The Company Name must not exceed 50 characters.');
    });

    it('should not be able to navigate to branch setup step if company creation failed', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Test Company');
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').click();

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

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').click();

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      cy.get('[data-cy="company-logo"]').should('exist').and('have.text', 'Good Omens');
    });

    it('should display validation messages if the branch creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchBranchesFailedRequest');

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'Branch Name is required');

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type(
        'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long branch name'
      );

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'The Branch Name must not exceed 50 characters.');
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
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName')
        .find('input')
        .should('have.value', 'Admin');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName')
        .find('input')
        .should('have.value', 'Mock');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName')
        .find('input')
        .should('have.value', 'Admin Oidc Mock');
    });

    it('should display validation messages if the employee creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();
      interceptCreateEmployeeFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchEmployeeFailedRequest');

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName-validation')
        .should('exist')
        .and('have.text', 'First Name is required');

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName-validation')
        .should('exist')
        .and('have.text', 'Last Name is required');
    });

    it('should not be able to navigate to dashboard if employee creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchEmployeeFailedRequest();
      interceptCreateEmployeeFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchEmployeeFailedRequest');

      cy.url().should('include', '/setup/employee');

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').click();

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

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').type('Gabriel');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').type('Archangel');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName')
        .find('input')
        .type('Gabriel Admin Archangel');

      interceptFetchEmployeeRequest();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').click();

      cy.wait('@createEmployeeRequest');
      cy.wait('@fetchEmployeeRequest');

      cy.url().should('include', '/manage/dashboard');
    });
  });
});
