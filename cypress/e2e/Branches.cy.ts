import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  clickField,
  getLinearLoader,
  getTablePaginationDisplayedRows,
  getTablePaginationSizeInput,
  getTestSelectorByModule,
  search,
  selectAction,
  selectNavigationMenuItem,
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
  interceptFetchEmployeesRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchBranchesByIdsRequest,
} from '../support/interceptors';

const branchAdminRoutes = [ROUTES.newBranch.path, `${ROUTES.branches.path}/edit/222222222222`];

describe('Branches Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchProfileRequest();
    cy.visit(ROUTES.branches.path);
  });

  const roles = [
    {
      role: 'User',
      loginMock: () => cy.loginMock(),
      tableLayoutActionButtonExists: false,
      viewActionButtonExists: true,
      editActionButtonExists: false,
      deleteActionButtonExists: false,
    },
    {
      role: 'Admin',
      loginMock: () => cy.loginMock(true),
      tableLayoutActionButtonExists: true,
      viewActionButtonExists: true,
      editActionButtonExists: true,
      deleteActionButtonExists: true,
    },
  ];

  roles.forEach(
    ({ role, loginMock, tableLayoutActionButtonExists, viewActionButtonExists, editActionButtonExists, deleteActionButtonExists }) => {
      const isAdminRole = role === 'Admin';

      describe(`${role} Role`, () => {
        beforeEach(() => {
          loginMock();
        });

        it('should be navigated to branch setup page if there are no branches', () => {
          interceptFetchBranchesFailedRequest();

          cy.url().should('include', '/setup/branch');
        });

        it('should not display the linear loader if fetching branches is in progress, it is a part of fetchSetupData', () => {
          interceptFetchBranchesRequest();

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'page-subtitle').should('not.exist');

          cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
        });

        it('should not display the loader if the request resolves quickly', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchBranchesQuickRequest', fixture: 'branches', statusCode: 200, delay: 50 }
          );

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
        });

        it('should render branches table if there are fetched branches', () => {
          interceptFetchBranchesRequest();

          cy.wait('@fetchBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'page-subtitle').should('not.exist');
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
          getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '10');
          getTablePaginationDisplayedRows(Module.branchManagement, SubModule.branchTable, 'table-pagination').should(
            'have.text',
            '1–1 of 1'
          );
        });

        it('should send correct request when pagination changes', () => {
          interceptFetchBranchesRequest();

          cy.wait('@fetchBranchesRequest');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-pagination')
            .find('.MuiTablePagination-input')
            .click();

          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 3);
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '10');
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '20');
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(2).should('have.text', '50');

          interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 20, search: '' }, { alias: 'fetch20BranchesRequest' });
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="20"]').click();

          cy.wait('@fetch20BranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=20');

          getTablePaginationSizeInput(Module.branchManagement, SubModule.branchTable, 'table-pagination').should('have.value', '20');
        });

        it('should send correct request when search changes', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
          );

          cy.wait('@fetchMultipleBranchesRequest');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);

          search(Module.branchManagement, SubModule.branchTable, 'search-branches', 'New');

          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: 'New' },
            { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
          );

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
          cy.wait('@fetchSearchedBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10&search=New');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

          search(Module.branchManagement, SubModule.branchTable, 'search-branches', 'Old');

          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: 'Old' },
            { alias: 'fetchSearchedNoBranchesRequest', fixture: 'branches-empty' }
          );

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
          cy.wait('@fetchSearchedNoBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10&search=Old');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 0);

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches').find('input').clear();

          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
          );

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
          cy.wait('@fetchMultipleBranchesRequest').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
        });

        it('should display correct branches and employees when searching branches and navigating to employees', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10 },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
          );
          interceptFetchBranchesByIdsRequest({ ids: [222222222222] });

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
          cy.wait('@fetchMultipleBranchesRequest');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);

          search(Module.branchManagement, SubModule.branchTable, 'search-branches', 'Test');

          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: 'Test' },
            { alias: 'fetchSearchedNoBranchesRequest', fixture: 'branches-empty' }
          );

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');

          cy.wait('@fetchSearchedNoBranchesRequest');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 0);

          selectNavigationMenuItem('Employees');

          interceptFetchEmployeesRequest(
            { pageNumber: 1, pageSize: 10 },
            { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
          );

          getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');

          cy.wait('@fetchMultipleEmployeesRequest');

          getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'search-employees')
            .find('input')
            .should('have.value', '');
          getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row', true).should('have.length', 3);

          selectNavigationMenuItem('Branches');

          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10 },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
          );

          getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');

          cy.wait('@fetchMultipleBranchesRequest')
            .its('request.url')
            .should('include', 'Branches?pageNumber=1&pageSize=10')
            .and('not.include', 'search');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
        });

        it(`should ${isAdminRole ? '' : 'not '}be able to manually navigate to branch management page`, () => {
          interceptFetchBranchesRequest();

          branchAdminRoutes.forEach((route) => {
            cy.visit(route);
            cy.url().should('include', isAdminRole ? route : ROUTES.company.path);
          });
        });

        it('should be able to navigate by buttons to branch view page', () => {
          interceptFetchBranchesRequest();
          interceptFetchBranchByIdRequest('222222222222');

          cy.visit(ROUTES.branches.path);

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').should(
            tableLayoutActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').should('exist').click();
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').should(
            viewActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').should(
            editActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222222').should(
            deleteActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();

          cy.url().should('include', `${ROUTES.branches.path}/view/222222222222`);
        });

        it('should display branch management buttons', () => {
          interceptFetchBranchesRequest();

          if (tableLayoutActionButtonExists) {
            getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button')
              .should('exist')
              .and('have.text', 'New Branch');
          } else {
            getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').should('not.exist');
          }

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').should(
            viewActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').should(
            editActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-delete-222222222222').should(
            deleteActionButtonExists ? 'exist' : 'not.exist'
          );
        });

        it('should mark the timeZone as invalid if it is an invalid company timeZone', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple-different-countries' }
          );
          cy.visit(ROUTES.branches.path);

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
          cy.visit(ROUTES.branches.path);

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-name').click();

          cy.url().should('include', `${ROUTES.branches.path}/view/222222222222`);
        });

        it('should reset the search state when the clear icon is clicked', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
          );
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: 'New' },
            { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
          );

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches').find('input').type('New');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches-clear').click();

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches').find('input').should('have.value', '');

          cy.wait('@fetchMultipleBranchesRequest');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
        });

        it('should mark the fields as invalid if the company country is different than the branch address country', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple-different-countries' }
          );
          cy.visit(ROUTES.branches.path);

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222224-timeZoneName')
            .find('p')
            .should('have.attr', 'data-invalid');
          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222224-fullAddress')
            .find('p')
            .should('have.attr', 'data-invalid');
        });

        it('should display default values if there is no address provided', () => {
          interceptFetchBranchesRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple-different-countries' }
          );
          cy.visit(ROUTES.branches.path);

          cy.wait('@fetchMultipleBranchesRequest');

          getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222225-fullAddress')
            .find('p')
            .should('have.text', '-');
        });
      });
    }
  );

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should reset the search state after a new branch has been created', () => {
      interceptCreateBranchRequest();
      interceptFetchBranchesRequest();
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10, search: 'New' },
        { alias: 'fetchSearchedBranchesRequest', fixture: 'branches' }
      );

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches').find('input').type('New');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-title-back-button').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches').find('input').should('have.value', '');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').type('Anchorage Branch');
      selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/Anchorage');
      clickField(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchManagement, SubModule.branchDetails);

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchMultipleUpdatedBranchesRequest', fixture: 'branches-multiple-updated' }
      );

      cy.wait('@createBranchRequest');
      cy.wait('@fetchMultipleUpdatedBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'search-branches').find('input').should('have.value', '');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
    });

    it('should be able to navigate by buttons to branch management page', () => {
      interceptFetchBranchesRequest();
      interceptFetchBranchByIdRequest('222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();
      cy.url().should('include', branchAdminRoutes[0]);

      cy.visit(ROUTES.branches.path);

      selectAction(Module.branchManagement, SubModule.branchTable, 'edit', '222222222222');
      cy.url().should('include', branchAdminRoutes[1]);
    });

    it('should not be able to delete a branch if the branch deletion failed', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit(ROUTES.branches.path);

      interceptDeleteBranchFailedRequest('222222222223');
      selectAction(Module.branchManagement, SubModule.branchTable, 'delete', '222222222223');

      cy.wait('@deleteBranchFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to delete the Branch');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 2);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222222-name').should('exist');
    });

    it('should be able to delete a branch if the branch deletion succeeded', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit(ROUTES.branches.path);

      interceptDeleteBranchRequest('222222222223');
      selectAction(Module.branchManagement, SubModule.branchTable, 'delete', '222222222223');

      interceptFetchBranchesRequest();
      cy.wait('@deleteBranchRequest');
      cy.wait('@fetchBranchesRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Branch has been successfully deleted');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 1);
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-222222222223-name').should('not.exist');
    });
  });
});
