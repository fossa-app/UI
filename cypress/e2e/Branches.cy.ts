import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getTablePaginationDisplayedRows, getTablePaginationSizeInput, getTestSelectorByModule } from '../support/helpers';
import {
  interceptDeleteBranchFailedRequest,
  interceptDeleteBranchRequest,
  interceptFetchBranchByIdRequest,
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

    it('should not display the linear loader if fetching branches is in progress, it is a part of fetchSetupData', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('have.css', 'visibility', 'hidden');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('have.css', 'visibility', 'hidden');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-title').should('have.text', 'Branches');
    });

    it('should render branches table if there are fetched branches', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('have.css', 'visibility', 'hidden');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-name').should('have.text', 'Name');
      getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '5');
      getTablePaginationDisplayedRows(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.text', '1–1 of 1');
    });

    it('should send correct request when pagination changes', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-pagination').find('.MuiTablePagination-input').click();

      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

      interceptFetchBranchesRequest(1, 10, 'fetch10BranchesRequest');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.wait('@fetch10BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '10');
    });

    it('should not be able to manually navigate to branch management page', () => {
      interceptFetchBranchesRequest();

      branchAdminRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/manage/dashboard');
      });
    });

    it('should be able to navigate by buttons to branch view page', () => {
      interceptFetchBranchesRequest();
      interceptFetchBranchByIdRequest('222222222222');

      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').should('exist').click();

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').should('exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222222').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();

      cy.url().should('include', '/manage/branches/view/222222222222');
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

    it('should not display the linear loader if fetching branches is in progress, it is a part of fetchSetupData', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('have.css', 'visibility', 'hidden');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');

      cy.wait('@fetchBranchesRequest');

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('have.css', 'visibility', 'hidden');
    });

    it('should render branches table if there are fetched branches', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('have.css', 'visibility', 'hidden');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-name').should('have.text', 'Name');
      getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '5');
      getTablePaginationDisplayedRows(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.text', '1–1 of 1');
    });

    it('should send correct request when pagination changes', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-pagination').find('.MuiTablePagination-input').click();

      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

      interceptFetchBranchesRequest(1, 10, 'fetch10BranchesRequest');
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.wait('@fetch10BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '10');
    });

    it('should display branch management buttons', () => {
      interceptFetchBranchesRequest();

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button')
        .should('exist')
        .and('have.text', 'New Branch');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').should('exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').should('exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222222').should('exist');
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
      interceptFetchBranchByIdRequest('222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();
      cy.url().should('include', branchAdminRoutes[0]);

      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').click();
      cy.url().should('include', branchAdminRoutes[1]);
    });

    it('should be able to navigate by buttons to branch view page', () => {
      interceptFetchBranchesRequest();
      interceptFetchBranchByIdRequest('222222222222');

      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();

      cy.url().should('include', '/manage/branches/view/222222222222');
    });

    it('should not be able to delete a branch if the branch deletion failed', () => {
      interceptFetchBranchesRequest(1, 5, 'fetchMultipleBranchesRequest', 'branches-multiple');
      cy.visit('/manage/branches');

      interceptDeleteBranchFailedRequest('222222222223');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222223').should('exist').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222223').click();

      cy.wait('@deleteBranchFailedRequest');

      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to delete Branch');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 2);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-New York Branch').should('exist');
    });

    it('should be able to delete a branch if the branch deletion succeeded', () => {
      interceptFetchBranchesRequest(1, 5, 'fetchMultipleBranchesRequest', 'branches-multiple');
      cy.visit('/manage/branches');

      interceptDeleteBranchRequest('222222222223');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222223').should('exist').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222223').click();

      interceptFetchBranchesRequest();
      cy.wait('@deleteBranchRequest');
      cy.wait('@fetchBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-New York').should('not.exist');
    });
  });
});
