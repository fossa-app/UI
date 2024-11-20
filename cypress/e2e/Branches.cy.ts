import { getTableBodyRow, getTableLoader, getTablePaginationDisplayedRows, getTablePaginationSizeInput } from '../support/helpers';
import {
  interceptDeleteBranchFailedRequest,
  interceptDeleteBranchRequest,
  interceptFetchBranchesFailedRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const branchAdminRoutes = ['/manage/branches/new', '/manage/branches/edit/222222222222'];

describe('Branches Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchEmployeeRequest();
    cy.visit('/manage/branches');
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
    });

    it('should be navigated to branch setup page if there are no branches', () => {
      interceptFetchBranchesFailedRequest();

      cy.url().should('include', '/setup/branch');
    });

    it('should display the loader if fetching branches is in progress', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTableLoader('branch-table').should('not.have.css', 'visibility', 'hidden');
      cy.get('[data-cy="table-no-branches"]').should('not.exist');
      getTableLoader('branch-table').should('have.css', 'visibility', 'hidden');
      cy.get('[data-cy="table-layout-title"]').should('have.text', 'Branches');
    });

    it('should render branches table if there are fetched branches', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      cy.get('[data-cy="table-no-branches"]').should('not.exist');
      getTableLoader('branch-table').should('have.css', 'visibility', 'hidden');
      getTableBodyRow('branch-table').should('have.length', 1);
      cy.get('[data-cy="branch-table"]').find('[data-cy="table-header-cell-name"]').should('have.text', 'Name');
      getTablePaginationSizeInput('branch-table').should('have.value', '5');
      getTablePaginationDisplayedRows('branch-table').should('have.text', '1–1 of 1');
    });

    it('should send correct request when pagination changes', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest');
      cy.get('[data-cy="branch-table"]').find('[data-cy="table-pagination"] .MuiTablePagination-input').click();

      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

      interceptFetchBranchesRequest(1, 10, 'fetch10BranchesRequest');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.wait('@fetch10BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTablePaginationSizeInput('branch-table').should('have.value', '10');
    });

    it('should not be able to manually navigate to branch management page', () => {
      interceptFetchBranchesRequest();

      branchAdminRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/manage/dashboard');
      });
    });

    it('should not display branch management buttons', () => {
      interceptFetchBranchesRequest();

      cy.get('[data-cy="action-button"]').should('not.exist');
      cy.get('[data-cy="edit-222222222222-branch-button"]').should('not.exist');
      cy.get('[data-cy="delete-222222222222-branch-button"]').should('not.exist');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should be navigated to branch setup page if there are no branches', () => {
      interceptFetchBranchesFailedRequest();

      cy.url().should('include', '/setup/branch');
    });

    it('should display the loader if fetching branches is in progress', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTableLoader('branch-table').should('not.have.css', 'visibility', 'hidden');
      cy.get('[data-cy="table-no-branches"]').should('not.exist');

      cy.wait('@fetchBranchesRequest');

      getTableLoader('branch-table').should('have.css', 'visibility', 'hidden');
    });

    it('should render branches table if there are fetched branches', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      cy.get('[data-cy="table-no-branches"]').should('not.exist');
      getTableLoader('branch-table').should('have.css', 'visibility', 'hidden');
      getTableBodyRow('branch-table').should('have.length', 1);
      cy.get('[data-cy="branch-table"]').find('[data-cy="table-header-cell-name"]').should('have.text', 'Name');
      getTablePaginationSizeInput('branch-table').should('have.value', '5');
      getTablePaginationDisplayedRows('branch-table').should('have.text', '1–1 of 1');
    });

    it('should send correct request when pagination changes', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest');
      cy.get('[data-cy="branch-table"]').find('[data-cy="table-pagination"] .MuiTablePagination-input').click();

      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

      interceptFetchBranchesRequest(1, 10, 'fetch10BranchesRequest');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.wait('@fetch10BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTablePaginationSizeInput('branch-table').should('have.value', '10');
    });

    it('should display branch management buttons', () => {
      interceptFetchBranchesRequest();

      cy.get('[data-cy="action-button"]').should('exist').and('have.text', 'New Branch');
      cy.get('[data-cy="edit-222222222222-branch-button"]').should('exist');
      cy.get('[data-cy="delete-222222222222-branch-button"]').should('exist');
    });

    it('should be able to manually navigate to branch management page', () => {
      interceptFetchBranchesRequest();

      branchAdminRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', route);
      });
    });

    it('should be able to navigate by buttons to branch management page', () => {
      interceptFetchBranchesRequest();

      cy.get('[data-cy="action-button"]').click();
      cy.url().should('include', branchAdminRoutes[0]);

      cy.visit('/manage/branches');

      cy.get('[data-cy="edit-222222222222-branch-button"]').click();
      cy.url().should('include', branchAdminRoutes[1]);
    });

    it('should not be able to delete a branch if the branch deletion failed', () => {
      interceptFetchBranchesRequest(1, 5, 'fetchMultipleBranchesRequest', 'branches-multiple');
      cy.visit('/manage/branches');

      interceptDeleteBranchFailedRequest('222222222223');
      cy.get('[data-cy="delete-222222222223-branch-button"]').click();

      cy.wait('@deleteBranchFailedRequest');

      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to delete Branch');
      getTableBodyRow('branch-table').should('have.length', 2);
      cy.get('[data-cy="branch-table"]').find('[data-cy="table-body-cell-New York"]').should('exist');
    });

    it('should be able to delete a branch if the branch deletion succeeded', () => {
      interceptFetchBranchesRequest(1, 5, 'fetchMultipleBranchesRequest', 'branches-multiple');
      cy.visit('/manage/branches');

      interceptDeleteBranchRequest('222222222223');
      cy.get('[data-cy="delete-222222222223-branch-button"]').click();

      interceptFetchBranchesRequest();
      cy.wait('@deleteBranchRequest');
      cy.wait('@fetchBranchesRequest');

      getTableBodyRow('branch-table').should('have.length', 1);
      cy.get('[data-cy="branch-table"]').find('[data-cy="table-body-cell-New York"]').should('not.exist');
    });
  });
});
