import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/types';
import {
  clearInputField,
  getLinearLoader,
  getTablePaginationDisplayedRows,
  getTablePaginationSizeInput,
  getTestSelectorByModule,
  search,
  selectAction,
  selectNavigationMenuItem,
} from 'support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchProfileRequest,
  interceptFetchEmployeesFailedRequest,
  interceptFetchEmployeesRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesByIdsRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchDepartmentsByIdsRequest,
  interceptFetchDepartmentsRequest,
  interceptFetchDepartmentByIdRequest,
  interceptFetchEmployeesByIdsRequest,
} from 'support/interceptors';

describe('Employee Catalog Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
    interceptFetchProfileRequest();
    cy.visit(ROUTES.employees.path);
  });

  const roles = [
    {
      role: 'User',
      loginMock: () => cy.loginMock(),
      viewActionButtonExists: true,
      editActionButtonExists: false,
      deleteActionButtonExists: false,
    },
    {
      role: 'Admin',
      loginMock: () => cy.loginMock(true),
      viewActionButtonExists: true,
      editActionButtonExists: true,
      deleteActionButtonExists: false,
    },
  ];

  roles.forEach(({ role, loginMock, viewActionButtonExists, editActionButtonExists, deleteActionButtonExists }) => {
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
        interceptFetchBranchesByIdsRequest();
        interceptFetchDepartmentsByIdsRequest();
      });

      it('should display the default message within the table if there are no employees', () => {
        interceptFetchEmployeesFailedRequest();

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'page-title').should('have.text', 'Employees');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'page-subtitle').should(
          'have.text',
          'No Employees Found'
        );
      });

      it('should display the loader if fetching employees is in progress', () => {
        interceptFetchEmployeesRequest();
        interceptFetchEmployeesByIdsRequest();

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');
        cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'page-subtitle').should('not.exist');

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('not.exist');
      });

      it('should not display the loader if the request resolves quickly', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchEmployeesQuickRequest', fixture: 'employee/employees', statusCode: 200, delay: 50 }
        );
        interceptFetchEmployeesByIdsRequest();

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('not.exist');
      });

      it('should render employees table if there are fetched employees', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
        );
        interceptFetchEmployeesByIdsRequest();

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');
        cy.wait('@fetchMultipleEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'page-subtitle').should('not.exist');
        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('not.exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-firstName').should(
          'have.text',
          'First Name'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-lastName').should(
          'have.text',
          'Last Name'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-fullName').should(
          'have.text',
          'Full Name'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-jobTitle').should(
          'have.text',
          'Job Title'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-assignedBranchName').should(
          'have.text',
          'Assigned Branch'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-assignedDepartmentName').should(
          'have.text',
          'Assigned Department'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-reportsToName').should(
          'have.text',
          'Manager'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-firstName')
          .find('p')
          .should('exist')
          .and('have.text', 'Anthony');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-lastName')
          .should('exist')
          .and('have.text', 'Crowley');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-fullName')
          .should('exist')
          .and('have.text', 'Anthony User Crowley');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-jobTitle')
          .should('exist')
          .and('have.text', 'The Best Guy');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-assignedBranchName')
          .should('exist')
          .and('have.text', 'New York Branch');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-reportsToName')
          .should('exist')
          .and('have.text', 'Gabriel Admin Archangel');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-assignedDepartmentName')
          .should('exist')
          .and('have.text', 'Production');
        getTablePaginationSizeInput(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('have.value', '10');
        getTablePaginationDisplayedRows(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination').should(
          'have.text',
          '1–3 of 3'
        );
      });

      it('should send correct request when the pagination changes', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: '' },
          { alias: 'fetch10EmployeesRequest', fixture: 'employee/employees-multiple-page-one' }
        );
        interceptFetchEmployeesByIdsRequest();

        cy.wait('@fetch10EmployeesRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 10);
        getTablePaginationDisplayedRows(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination').should(
          'have.text',
          '1–10 of 15'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination')
          .find('.MuiTablePagination-input')
          .click();

        cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 3);
        cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '10');
        cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '20');
        cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(2).should('have.text', '50');

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 20, search: '' },
          { alias: 'fetch20EmployeesRequest', fixture: 'employee/employees-multiple-page-size-20' }
        );
        cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="20"]').click();

        cy.wait('@fetch20EmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=20');

        getTablePaginationSizeInput(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination').should('have.value', '20');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 15);
        getTablePaginationDisplayedRows(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination').should(
          'have.text',
          '1–15 of 15'
        );
      });

      it('should send correct request when the search changes', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
        );
        interceptFetchEmployeesByIdsRequest();

        cy.wait('@fetchMultipleEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: 'Anthony' },
          { alias: 'fetchSearchedEmployeesRequest', fixture: 'employee/employees' }
        );

        search(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees', 'Anthony');

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');

        cy.wait('@fetchSearchedEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10&search=Anthony');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 1);

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: 'Anthonyy' },
          { alias: 'fetchSearchedNoEmployeesRequest', fixture: 'employee/employees-empty' }
        );

        search(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees', 'y');

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');

        cy.wait('@fetchSearchedNoEmployeesRequest')
          .its('request.url')
          .should('include', 'Employees?pageNumber=1&pageSize=10&search=Anthonyy');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 0);
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'page-subtitle')
          .should('exist')
          .and('have.text', 'No Employees Found');

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: '' },
          { alias: 'fetchMultipleEmployeesClearedRequest', fixture: 'employee/employees-multiple' }
        );

        clearInputField(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees');

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');
        cy.wait('@fetchMultipleEmployeesClearedRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);
      });

      it('should send correct request when search and pagination change', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: '' },
          { alias: 'initialEmployeesRequest', fixture: 'employee/employees-multiple' }
        );
        interceptFetchEmployeesByIdsRequest();

        cy.wait('@initialEmployeesRequest');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: 'Anthony' },
          { alias: 'searchEmployeesRequest', fixture: 'employee/employees' }
        );
        search(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees', 'Anthony');

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');
        cy.wait('@searchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10&search=Anthony');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 1);

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 20, search: 'Anthony' },
          { alias: 'searchEmployeesPageSize20', fixture: 'employee/employees-multiple-page-size-20' }
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination')
          .find('.MuiTablePagination-input')
          .click();
        cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="20"]').click();

        cy.wait('@searchEmployeesPageSize20').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=20&search=Anthony');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 15);
        getTablePaginationSizeInput(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination').should('have.value', '20');
      });

      it('should reset the search state when the clear icon is clicked', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: 'Anthony' },
          { alias: 'fetchSearchedEmployeesRequest', fixture: 'employee/employees' }
        );
        interceptFetchEmployeesByIdsRequest();

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees').find('input').type('Anthony');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 1);
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees-clear').click();
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees')
          .find('input')
          .should('have.value', '');

        cy.wait('@fetchMultipleEmployeesRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);

        cy.intercept('GET', '**/Employees?pageNumber=1&pageSize=10').as('fetchEmployeesClearedSearchRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees-clear').click();

        cy.get('@fetchEmployeesClearedSearchRequest.all').should('have.length', 0);
      });

      it('should display correct employees and branches when searching employees and navigating to branches', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
        );
        interceptFetchEmployeesByIdsRequest();

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');
        cy.wait('@fetchMultipleEmployeesRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, search: 'Test' },
          { alias: 'fetchSearchedNoEmployeesRequest', fixture: 'employee/employees-empty' }
        );

        search(Module.employeeManagement, SubModule.employeeCatalog, 'search-employees', 'Test');

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');

        cy.wait('@fetchSearchedNoEmployeesRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 0);

        selectNavigationMenuItem('Branches');

        interceptFetchBranchesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
        );

        getLinearLoader(Module.branchManagement, SubModule.branchCatalog, 'table').should('exist');

        cy.wait('@fetchMultipleBranchesRequest');

        getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'search-branches').find('input').should('have.value', '');
        getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-row', true).should('have.length', 2);

        selectNavigationMenuItem('Employees');

        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
        );

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');

        cy.wait('@fetchMultipleEmployeesRequest')
          .its('request.url')
          .should('include', 'Employees?pageNumber=1&pageSize=10')
          .and('not.include', 'search');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);
      });

      it('should display action column and correct actions', () => {
        interceptFetchEmployeesRequest();
        interceptFetchEmployeesByIdsRequest();

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-layout-action-button').should('not.exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'actions-menu-icon-333333333335')
          .should('exist')
          .click();
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-view-333333333335').should(
          viewActionButtonExists ? 'exist' : 'not.exist'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-edit-333333333335').should(
          editActionButtonExists ? 'exist' : 'not.exist'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-delete-333333333335').should(
          deleteActionButtonExists ? 'exist' : 'not.exist'
        );
      });

      it('should be able to navigate to the View Employee page', () => {
        interceptFetchEmployeesRequest();
        interceptFetchEmployeesByIdsRequest();
        interceptFetchEmployeeByIdRequest('333333333335');
        interceptFetchEmployeeByIdRequest('333333333333');
        interceptFetchBranchByIdRequest('222222222222');
        interceptFetchDepartmentByIdRequest('444444444444');

        cy.visit(`${ROUTES.employees.path}/view/333333333335`);

        cy.url().should('include', `${ROUTES.employees.path}/view/333333333335`);

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'page-title-back-button').click();
        selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'view', '333333333335');

        cy.url().should('include', `${ROUTES.employees.path}/view/333333333335`);
      });

      it('should render the mobile view if there are fetched employees', () => {
        cy.mockMobileView();
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10 },
          { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
        );
        interceptFetchEmployeesByIdsRequest();

        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');
        cy.wait('@fetchMultipleEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'page-subtitle').should('not.exist');
        getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('not.exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-333333333335-firstName').should(
          'have.text',
          'First Name'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-333333333335-lastName').should(
          'have.text',
          'Last Name'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-333333333335-fullName').should(
          'have.text',
          'Full Name'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-header-cell-333333333335-jobTitle').should(
          'have.text',
          'Job Title'
        );
        getTestSelectorByModule(
          Module.employeeManagement,
          SubModule.employeeCatalog,
          'table-header-cell-333333333335-assignedBranchName'
        ).should('have.text', 'Assigned Branch');
        getTestSelectorByModule(
          Module.employeeManagement,
          SubModule.employeeCatalog,
          'table-header-cell-333333333335-assignedDepartmentName'
        ).should('have.text', 'Assigned Department');
        getTestSelectorByModule(
          Module.employeeManagement,
          SubModule.employeeCatalog,
          'table-header-cell-333333333335-reportsToName'
        ).should('have.text', 'Manager');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-firstName')
          .find('p')
          .should('exist')
          .and('have.text', 'Anthony');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-lastName')
          .should('exist')
          .and('have.text', 'Crowley');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-fullName')
          .should('exist')
          .and('have.text', 'Anthony User Crowley');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-jobTitle')
          .should('exist')
          .and('have.text', 'The Best Guy');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-assignedBranchName')
          .should('exist')
          .and('have.text', 'New York Branch');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-assignedDepartmentName')
          .should('exist')
          .and('have.text', 'Production');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-reportsToName')
          .should('exist')
          .and('have.text', 'Gabriel Admin Archangel');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'actions-menu-icon-333333333335')
          .should('exist')
          .click();
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-view-333333333335').should(
          viewActionButtonExists ? 'exist' : 'not.exist'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-edit-333333333335').should(
          editActionButtonExists ? 'exist' : 'not.exist'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-delete-333333333335').should(
          deleteActionButtonExists ? 'exist' : 'not.exist'
        );
        getTablePaginationSizeInput(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('have.value', '10');
        getTablePaginationDisplayedRows(Module.employeeManagement, SubModule.employeeCatalog, 'table-pagination').should(
          'have.text',
          '1–3 of 3'
        );
      });
    });
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
      interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 1 });
    });

    it('should not be able to navigate to the Edit Employee page', () => {
      interceptFetchEmployeesRequest();
      interceptFetchBranchesByIdsRequest();
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');

      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.url().should('include', ROUTES.company.path);
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should be able to navigate to the Edit Employee page', () => {
      interceptFetchEmployeesRequest();
      interceptFetchEmployeesByIdsRequest();
      interceptFetchBranchesByIdsRequest();
      interceptFetchDepartmentsByIdsRequest();
      interceptFetchBranchesRequest();
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchEmployeeByIdRequest('333333333333');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchDepartmentByIdRequest('444444444444');

      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.url().should('include', `${ROUTES.employees.path}/edit/333333333335`);

      cy.visit(ROUTES.employees.path);

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'actions-menu-icon-333333333335').click();
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'action-edit-333333333335').click();

      cy.url().should('include', `${ROUTES.employees.path}/edit/333333333335`);
    });
  });
});
