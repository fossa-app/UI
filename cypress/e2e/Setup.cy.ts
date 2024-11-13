import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchBranchesFailedRequest,
  interceptFetchEmployeeFailedRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchEmployeeRequest,
} from '../support/interceptors';

const setupRoutes = ['/setup/company', '/setup/branch', '/setup/employee'];

describe('Setup Tests', () => {
  describe('User Role', () => {
    beforeEach(() => {
      interceptFetchClientRequest();
      interceptFetchSystemLicenseRequest();
      interceptFetchCompanyLicenseRequest();
      cy.loginMock();
    });

    it('should navigate to company setup page and no other setup pages if there is no company', () => {
      interceptFetchCompanyFailedRequest();

      cy.visit('/setup/company');
      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
      cy.get('[data-cy="setup-next-button"]').should('have.attr', 'disabled');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/company');
      });
    });

    it('should navigate to branch setup page and no other setup pages if company exists', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();

      cy.visit('/setup/branch');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      cy.get('[data-cy="setup-next-button"]').should('have.attr', 'disabled');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/branch');
      });
    });

    it('should navigate to employee setup page and no other setup pages if company and branch exist', () => {
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
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      interceptFetchClientRequest();
      interceptFetchSystemLicenseRequest();
      interceptFetchCompanyLicenseRequest();
      cy.loginMock(undefined, true);
    });

    it('should navigate to company setup page and no other setup pages if there is no company', () => {
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

    it('should navigate to branch setup page and no other setup pages if company exists', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();

      cy.visit('/setup/branch');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      cy.get('[data-cy="setup-next-button"]').should('not.have.attr', 'disabled');

      setupRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/setup/branch');
      });
    });

    it('should navigate to employee setup page and no other setup pages if company and branch exist', () => {
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

    // it('should navigate through setup steps using buttons', () => {
    //   interceptFetchCompanyRequest();
    //   interceptFetchCompanyFailedRequest();
    //   interceptFetchBranchesRequest();
    //   interceptFetchBranchesFailedRequest();
    //   interceptFetchEmployeeRequest();
    //   interceptFetchEmployeeFailedRequest();

    //   cy.visit('/setup');

    //   cy.wait('@fetchCompanyFailedRequest');

    //   cy.url().should('include', '/setup/company');

    //   cy.wait('@fetchCompanyRequest');

    //   cy.wait('@fetchBranchesFailedRequest');

    //   cy.wait('@fetchBranchesRequest');

    //   cy.wait('@fetchEmployeeFailedRequest');

    //   cy.wait('@fetchEmployeeRequest');
    // });
  });
});
