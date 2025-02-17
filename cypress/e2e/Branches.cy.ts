import { Module, SubModule } from '../../src/shared/models';
import {
  clickActionButton,
  clickCheckboxField,
  getLinearLoader,
  getTablePaginationDisplayedRows,
  getTablePaginationSizeInput,
  getTestSelectorByModule,
  selectOption,
} from '../support/helpers';
import {
  interceptCreateBranchRequest,
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
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-title').should('have.text', 'Branches');
    });

    it('should render branches table if there are fetched branches', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-name').should('have.text', 'Name');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-timeZoneName').should(
        'have.text',
        'TimeZone'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-fullAddress').should(
        'have.text',
        'Address'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-timeZoneName')
        .find('p')
        .should('not.have.attr', 'data-invalid');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-fullAddress').should(
        'have.text',
        '270 W 11th Street, Apt 2E, New York, NY 10014, United States'
      );
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

      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 10, search: '' }, { alias: 'fetch10BranchesRequest' });
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.wait('@fetch10BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '10');
    });

    it('should send correct request when search changes', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );

      cy.wait('@fetchMultipleBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);

      cy.get('[data-cy="search-branches"]').find('input').clear();
      cy.get('[data-cy="search-branches"]').find('input').type('New');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: 'New' },
        { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
      cy.wait('@fetchSearchedBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5&search=New');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

      cy.get('[data-cy="search-branches"]').find('input').clear();
      cy.get('[data-cy="search-branches"]').find('input').type('Old');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: 'Old' },
        { alias: 'fetchSearchedNoBranchesRequest', fixture: 'branches-empty' }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
      cy.wait('@fetchSearchedNoBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5&search=Old');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 0);

      cy.get('[data-cy="search-branches"]').find('input').clear();

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
      cy.wait('@fetchMultipleBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
    });

    it('should not be able to manually navigate to branch management page', () => {
      interceptFetchBranchesRequest();

      branchAdminRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/manage/company');
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

    it('should mark the timeZone as invalid if it is an invalid company timeZone', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple-different-countries' }
      );
      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222224-timeZoneName')
        .find('p')
        .should('have.attr', 'data-invalid');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222224-fullAddress')
        .find('p')
        .should('have.attr', 'data-invalid');
    });

    it('should be able to navigate to the branch view page by clicking the branch name cell', () => {
      interceptFetchBranchesRequest();
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-name').click();

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
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');

      cy.wait('@fetchBranchesRequest');

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
    });

    it('should not display the loader if the request resolves quickly', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchBranchesQuickRequest', fixture: 'branches', statusCode: 200, delay: 50 }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
    });

    it('should render branches table if there are fetched branches', () => {
      interceptFetchBranchesRequest();

      cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches').should('not.exist');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-name').should('have.text', 'Name');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-timeZoneName').should(
        'have.text',
        'TimeZone'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-header-cell-fullAddress').should(
        'have.text',
        'Address'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-timeZoneName')
        .find('p')
        .should('not.have.attr', 'data-invalid');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-fullAddress').should(
        'have.text',
        '270 W 11th Street, Apt 2E, New York, NY 10014, United States'
      );
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

      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 10, search: '' }, { alias: 'fetch10BranchesRequest' });
      cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.wait('@fetch10BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '10');
    });

    it('should send correct request when search changes', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );

      cy.wait('@fetchMultipleBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);

      cy.get('[data-cy="search-branches"]').find('input').clear();
      cy.get('[data-cy="search-branches"]').find('input').type('New');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: 'New' },
        { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
      cy.wait('@fetchSearchedBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5&search=New');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

      cy.get('[data-cy="search-branches"]').find('input').clear();
      cy.get('[data-cy="search-branches"]').find('input').type('Old');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: 'Old' },
        { alias: 'fetchSearchedNoBranchesRequest', fixture: 'branches-empty' }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
      cy.wait('@fetchSearchedNoBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5&search=Old');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 0);

      cy.get('[data-cy="search-branches"]').find('input').clear();

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );

      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
      cy.wait('@fetchMultipleBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=5');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
    });

    it('should reset the search state after a new branch has been created', () => {
      interceptCreateBranchRequest();
      interceptFetchBranchesRequest();
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: 'New' },
        { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
      );

      cy.get('[data-cy="search-branches"]').find('input').type('New');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

      cy.get('[data-cy="page-title-back-button"]').click();
      cy.get('[data-cy="search-branches"]').find('input').should('have.value', '');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').type('Anchorage Branch');
      selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/Anchorage');
      clickCheckboxField(Module.branchManagement, SubModule.branchDetails, 'form-field-nonPhysicalAddress');
      clickActionButton(Module.branchManagement, SubModule.branchDetails);

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleUpdatedBranchesRequest', fixture: 'branches-multiple-updated' }
      );

      cy.wait('@createBranchRequest');
      cy.wait('@fetchMultipleUpdatedBranchesRequest');

      cy.get('[data-cy="search-branches"]').find('input').should('have.value', '');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
    });

    it('should reset the search state when the clear icon is clicked', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: 'New' },
        { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
      );

      cy.get('[data-cy="search-branches"]').find('input').type('New');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

      cy.get('[data-cy="search-branches-clear"]').click();

      cy.get('[data-cy="search-branches"]').find('input').should('have.value', '');

      cy.wait('@fetchMultipleBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
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

      // TODO: use selectAction method
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
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/branches');

      interceptDeleteBranchFailedRequest('222222222223');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222223').should('exist').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222223').click();

      cy.wait('@deleteBranchFailedRequest');

      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to delete the Branch');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-name').should('exist');
    });

    it('should be able to delete a branch if the branch deletion succeeded', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/branches');

      interceptDeleteBranchRequest('222222222223');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222223').should('exist').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222223').click();

      interceptFetchBranchesRequest();
      cy.wait('@deleteBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.get('[data-cy="success-snackbar"]').should('exist').and('contain.text', 'Branch has been successfully deleted');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222223-name').should('not.exist');
    });

    it('should mark the fields as invalid if the company country is different than the branch address country', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple-different-countries' }
      );
      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222224-timeZoneName')
        .find('p')
        .should('have.attr', 'data-invalid');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222224-fullAddress')
        .find('p')
        .should('have.attr', 'data-invalid');
    });

    it('should display default values if there is no address provided', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 5, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple-different-countries' }
      );
      cy.visit('/manage/branches');

      cy.wait('@fetchMultipleBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222225-fullAddress')
        .find('p')
        .should('have.text', '-');
    });

    it('should be able to navigate to the branch view page by clicking the branch name cell', () => {
      interceptFetchBranchesRequest();
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-name').click();

      cy.url().should('include', '/manage/branches/view/222222222222');
    });
  });
});
