import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/types';
import {
  clearInputField,
  clickActionButton,
  fillDepartmentDetailsForm,
  getLinearLoader,
  getTablePaginationDisplayedRows,
  getTablePaginationSizeInput,
  getTestSelectorByModule,
  search,
  selectAction,
} from 'support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchDepartmentsRequest,
  interceptFetchEmployeesByIdsRequest,
  interceptFetchDepartmentsByIdsRequest,
  interceptFetchDepartmentByIdRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchEmployeesRequest,
  interceptCreateDepartmentRequest,
  interceptDeleteDepartmentFailedRequest,
  interceptDeleteDepartmentRequest,
  interceptFetchCompanySettingsRequest,
} from 'support/interceptors';

const departmentAdminRoutes = [ROUTES.newDepartment.path, `${ROUTES.departments.path}/edit/444444444444`];

describe('Department Catalog Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
    interceptFetchProfileRequest();
    cy.visit(ROUTES.departments.path);
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

        it('should display the linear loader if fetching departments is in progress', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchEmployeesByIdsRequest();

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'page-subtitle').should('not.exist');

          cy.wait('@fetchDepartmentsByIdsRequest');
          cy.wait('@fetchEmployeesByIdsRequest');
          cy.wait('@fetchDepartmentsRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=10');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
        });

        it('should not display the loader if the request resolves quickly', () => {
          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchDepartmentsQuickRequest', statusCode: 200, delay: 50 }
          );
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchEmployeesByIdsRequest();

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
        });

        it('should render departments table if there are fetched departments', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchEmployeesByIdsRequest();

          cy.wait('@fetchDepartmentsRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=10');
          cy.wait('@fetchDepartmentsByIdsRequest');
          cy.wait('@fetchEmployeesByIdsRequest');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-header-cell-name').should(
            'have.text',
            'Name'
          );
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-header-cell-parentDepartmentName'
          ).should('have.text', 'Parent Department');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-header-cell-managerName').should(
            'have.text',
            'Manager'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444444-name').should(
            'have.text',
            'Production'
          );
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444444-parentDepartmentName'
          ).should('have.text', '-');
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444444-managerName'
          ).should('have.text', 'Anthony User Crowley');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444445-name').should(
            'have.text',
            'Line Production'
          );
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444445-parentDepartmentName'
          ).should('have.text', 'Production');
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444445-managerName'
          ).should('have.text', 'Anthony User Crowley');
          getTablePaginationSizeInput(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.value',
            '10'
          );
          getTablePaginationDisplayedRows(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.text',
            '1–4 of 4'
          );
        });

        it('should send correct request when the pagination changes', () => {
          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetch10DepartmentsRequest', fixture: 'department/departments-multiple-page-one' }
          );
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchEmployeesByIdsRequest();

          cy.wait(['@fetch10DepartmentsRequest', '@fetchDepartmentsByIdsRequest', '@fetchEmployeesByIdsRequest']);

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            10
          );
          getTablePaginationDisplayedRows(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.text',
            '1–10 of 12'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination')
            .find('.MuiTablePagination-input')
            .click();

          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 3);
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '10');
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '20');
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(2).should('have.text', '50');

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 20, search: '' },
            { alias: 'fetch20DepartmentsRequest', fixture: 'department/departments-multiple-page-size-20' }
          );
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="20"]').click();

          cy.wait('@fetch20DepartmentsRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=20');
          cy.wait(['@fetchDepartmentsByIdsRequest', '@fetchEmployeesByIdsRequest']);

          getTablePaginationSizeInput(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.value',
            '20'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            20
          );
          getTablePaginationDisplayedRows(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.text',
            '1–20 of 22'
          );
        });

        it('should send correct request when the search changes', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();

          cy.wait('@fetchDepartmentsRequest');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Production' },
            { alias: 'fetchSearchedDepartmentsRequest', fixture: 'department/departments-searched' }
          );

          search(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments', 'Production');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@fetchSearchedDepartmentsRequest')
            .its('request.url')
            .should('include', 'Departments?pageNumber=1&pageSize=10&search=Production');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            3
          );

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Productions' },
            { alias: 'fetchSearchedNoDepartmentsRequest', fixture: 'department/departments-empty' }
          );

          search(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments', 's');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@fetchSearchedNoDepartmentsRequest')
            .its('request.url')
            .should('include', 'Departments?pageNumber=1&pageSize=10&search=Productions');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            0
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'page-subtitle')
            .should('exist')
            .and('have.text', 'No Departments Found');

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchMultipleDepartmentsClearedRequest', fixture: 'department/departments' }
          );

          clearInputField(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@fetchMultipleDepartmentsClearedRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=10');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );
        });

        it('should send correct request when search and pagination change', () => {
          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'initialDepartmentsRequest', fixture: 'department/departments-multiple-page-one' }
          );
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchEmployeesByIdsRequest();

          cy.wait(['@initialDepartmentsRequest', '@fetchDepartmentsByIdsRequest', '@fetchEmployeesByIdsRequest']);
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            10
          );

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Production' },
            { alias: 'searchDepartmentsRequest', fixture: 'department/departments-searched' }
          );
          search(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments', 'Production');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@searchDepartmentsRequest')
            .its('request.url')
            .should('include', 'Departments?pageNumber=1&pageSize=10&search=Production');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            3
          );

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 20, search: 'Production' },
            { alias: 'searchDepartmentsPageSize20', fixture: 'department/departments-multiple-page-size-20' }
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination')
            .find('.MuiTablePagination-input')
            .click();
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="20"]').click();

          cy.wait('@searchDepartmentsPageSize20')
            .its('request.url')
            .should('include', 'Departments?pageNumber=1&pageSize=20&search=Production');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            20
          );
        });

        it('should reset the search state when the clear icon is clicked', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Production' },
            { alias: 'fetchSearchedDepartmentsRequest', fixture: 'department/departments-searched' }
          );
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
            .find('input')
            .type('Production');

          cy.wait(['@fetchSearchedDepartmentsRequest', '@fetchEmployeesByIdsRequest']);

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments-clear').click();

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
            .find('input')
            .should('have.value', '');

          cy.wait(['@fetchDepartmentsRequest', '@fetchEmployeesByIdsRequest']);

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );

          cy.intercept('GET', '**/Departments?pageNumber=1&pageSize=10').as('fetchDepartmentsClearedSearchRequest');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments-clear').click();

          cy.get('@fetchDepartmentsClearedSearchRequest.all').should('have.length', 0);
        });

        it(`should ${isAdminRole ? '' : 'not '}be able to manually navigate to the Department Management page`, () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesRequest();
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchDepartmentByIdRequest('444444444444');
          interceptFetchEmployeeByIdRequest('333333333335');

          departmentAdminRoutes.forEach((route) => {
            cy.visit(route);
            cy.location('pathname').should('eq', isAdminRole ? route : ROUTES.company.path);
          });
        });

        it('should be able to navigate by buttons to the View Department page', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchDepartmentByIdRequest('444444444444');
          interceptFetchEmployeeByIdRequest('333333333335');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').should(
            tableLayoutActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'actions-menu-icon-444444444444')
            .should('exist')
            .click();
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-view-444444444444').should(
            viewActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-edit-444444444444').should(
            editActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-delete-444444444444').should(
            deleteActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-view-444444444444').click();

          cy.location('pathname').should('eq', `${ROUTES.departments.path}/view/444444444444`);
        });

        it('should display department management buttons', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();

          if (tableLayoutActionButtonExists) {
            getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button')
              .should('exist')
              .and('have.text', 'New Department');
          } else {
            getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').should(
              'not.exist'
            );
          }

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-view-444444444444').should(
            viewActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-edit-444444444444').should(
            editActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-delete-444444444444').should(
            deleteActionButtonExists ? 'exist' : 'not.exist'
          );
        });

        it('should be able to navigate to the View Department page by clicking the department name cell', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchDepartmentByIdRequest('444444444444');
          interceptFetchEmployeeByIdRequest('333333333335');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444444-name')
            .find('p')
            .click();

          cy.location('pathname').should('eq', `${ROUTES.departments.path}/view/444444444444`);
        });

        it('should display default values if there is no parent department provided', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest();
          interceptFetchDepartmentsByIdsRequest();

          cy.wait('@fetchDepartmentsRequest');

          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444444-parentDepartmentName'
          )
            .find('p')
            .should('have.text', '-');
        });

        it('should render the mobile view if there are fetched departments', () => {
          cy.mockMobileView();
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsByIdsRequest();
          interceptFetchEmployeesByIdsRequest();

          cy.wait('@fetchDepartmentsRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=10');
          cy.wait('@fetchDepartmentsByIdsRequest');
          cy.wait('@fetchEmployeesByIdsRequest');

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-header-cell-444444444444-name').should(
            'have.text',
            'Name'
          );
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-header-cell-444444444444-parentDepartmentName'
          ).should('have.text', 'Parent Department');
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-header-cell-444444444444-managerName'
          ).should('have.text', 'Manager');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444444-name').should(
            'have.text',
            'Production'
          );
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444444-parentDepartmentName'
          ).should('have.text', '-');
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444444-managerName'
          ).should('have.text', 'Anthony User Crowley');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444445-name').should(
            'have.text',
            'Line Production'
          );
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444445-parentDepartmentName'
          ).should('have.text', 'Production');
          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444445-managerName'
          ).should('have.text', 'Anthony User Crowley');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'actions-menu-icon-444444444444')
            .should('exist')
            .click();
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-view-444444444444').should(
            viewActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-edit-444444444444').should(
            editActionButtonExists ? 'exist' : 'not.exist'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'action-delete-444444444444').should(
            deleteActionButtonExists ? 'exist' : 'not.exist'
          );
          getTablePaginationSizeInput(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.value',
            '10'
          );
          getTablePaginationDisplayedRows(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.text',
            '1–4 of 4'
          );
        });
      });
    }
  );

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    // TODO: flaky test
    it('should reset the search state after a new department has been created', () => {
      interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetchDepartmentsRequest' });
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10, search: 'Production' },
        { alias: 'fetchSearchedDepartmentsRequest', fixture: 'department/departments-searched' }
      );
      interceptFetchEmployeesByIdsRequest();
      interceptFetchDepartmentsByIdsRequest();
      interceptFetchDepartmentByIdRequest('444444444447');
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
      );
      interceptCreateDepartmentRequest();

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
        .find('input')
        .type('Production');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'page-title-back-button').click();
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
        .find('input')
        .should('have.value', '');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

      interceptFetchDepartmentsByIdsRequest();

      fillDepartmentDetailsForm({
        name: 'Set Design',
        parentDepartmentId: 444444444446,
        managerId: 333333333333,
      });

      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchCreatedDepartmentsRequest', fixture: 'department/departments-created' }
      );

      clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

      cy.wait('@createDepartmentRequest');

      cy.location('pathname').should('eq', ROUTES.departments.path);

      getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
      cy.wait('@fetchCreatedDepartmentsRequest');

      getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
        .find('input')
        .should('have.value', '');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 5);
    });

    it('should be able to navigate by buttons to the Department Management page', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeesByIdsRequest();
      interceptFetchDepartmentsByIdsRequest();
      interceptFetchDepartmentByIdRequest('444444444444');
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
      );

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();
      cy.location('pathname').should('eq', departmentAdminRoutes[0]);

      cy.visit(ROUTES.departments.path);

      selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444444');
      cy.location('pathname').should('eq', departmentAdminRoutes[1]);
    });

    it('should not be able to delete a department if the department deletion failed', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeesByIdsRequest();
      interceptFetchDepartmentsByIdsRequest();
      interceptDeleteDepartmentFailedRequest('444444444444');

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);
      selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'delete', '444444444444');

      cy.wait('@deleteDepartmentFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to delete the Department');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444444-name').should(
        'exist'
      );
    });

    it('should be able to delete a department if the department deletion succeeded', () => {
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchCreatedDepartmentsRequest', fixture: 'department/departments-created' }
      );
      interceptFetchEmployeesByIdsRequest();
      interceptFetchDepartmentsByIdsRequest();
      interceptDeleteDepartmentRequest('444444444448');

      getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
      cy.wait('@fetchCreatedDepartmentsRequest');

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 5);

      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchDepartmentsRequest', fixture: 'department/departments' }
      );
      selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'delete', '444444444448');

      getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
      cy.wait(['@deleteDepartmentRequest', '@fetchDepartmentsRequest']);

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Department has been successfully deleted');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444448-name').should(
        'not.exist'
      );
      getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');

      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
      );

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId').click();

      getTestSelectorByModule(
        Module.departmentManagement,
        SubModule.departmentDetails,
        'form-field-parentDepartmentId-option',
        true
      ).should('have.length', 4);
      getTestSelectorByModule(
        Module.departmentManagement,
        SubModule.departmentDetails,
        'form-field-parentDepartmentId-option-444444444448'
      ).should('not.exist');
    });
  });
});
