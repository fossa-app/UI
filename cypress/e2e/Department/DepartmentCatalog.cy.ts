import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
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
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchOnboardingBranchesRequest' });
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
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });

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
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
        });

        it('should render departments table if there are fetched departments', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });

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

        it('should send correct request when pagination changes', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });

          cy.wait('@fetchDepartmentsRequest');
          cy.wait('@fetchDepartmentsByIdsRequest');
          cy.wait('@fetchEmployeesByIdsRequest');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination')
            .find('.MuiTablePagination-input')
            .click();

          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 3);
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '10');
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '20');
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(2).should('have.text', '50');

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 20, search: '' },
            { alias: 'fetch20DepartmentsRequest', fixture: 'department/departments-multiple' }
          );
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444, 444444444448, 444444444447] });
          cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="20"]').click();

          cy.wait('@fetch20DepartmentsRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=20');

          getTablePaginationSizeInput(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.value',
            '20'
          );
          getTablePaginationDisplayedRows(Module.departmentManagement, SubModule.departmentCatalog, 'table-pagination').should(
            'have.text',
            '1–11 of 11'
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            11
          );
        });

        it('should send correct request when search changes', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });

          cy.wait('@fetchDepartmentsRequest');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );

          search(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments', 'Production');

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Production' },
            { alias: 'fetchSearchedDepartmentsRequest', fixture: 'department/departments-searched' }
          );
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334] });

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@fetchSearchedDepartmentsRequest')
            .its('request.url')
            .should('include', 'Departments?pageNumber=1&pageSize=10&search=Production');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            3
          );

          search(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments', 'Sound');

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Sound' },
            { alias: 'fetchSearchedNoDepartmentsRequest', fixture: 'department/departments-empty' }
          );

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@fetchSearchedNoDepartmentsRequest')
            .its('request.url')
            .should('include', 'Departments?pageNumber=1&pageSize=10&search=Sound');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            0
          );
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'page-subtitle')
            .should('exist')
            .and('have.text', 'No Departments Found');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments').find('input').clear();

          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: '' },
            { alias: 'fetchClearDepartmentsRequest', fixture: 'department/departments' }
          );

          getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
          cy.wait('@fetchClearDepartmentsRequest').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=10');
          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );
        });

        it('should reset the search state when the clear icon is clicked', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchDepartmentsRequest(
            { pageNumber: 1, pageSize: 10, search: 'Production' },
            { alias: 'fetchSearchedDepartmentsRequest', fixture: 'department/departments-searched' }
          );
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
            .find('input')
            .type('Production');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );

          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334] });

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments-clear').click();

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
            .find('input')
            .should('have.value', '');

          cy.wait('@fetchDepartmentsRequest');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should(
            'have.length',
            4
          );
        });

        it(`should ${isAdminRole ? '' : 'not '}be able to manually navigate to department management page`, () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesRequest();
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
          interceptFetchDepartmentByIdRequest('444444444444');
          interceptFetchEmployeeByIdRequest('333333333335');

          departmentAdminRoutes.forEach((route) => {
            cy.visit(route);
            cy.url().should('include', isAdminRole ? route : ROUTES.company.path);
          });
        });

        it('should be able to navigate by buttons to the department view page', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
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

          cy.url().should('include', `${ROUTES.departments.path}/view/444444444444`);
        });

        it('should display department management buttons', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });

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

        it('should be able to navigate to the department view page by clicking the department name cell', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
          interceptFetchDepartmentByIdRequest('444444444444');
          interceptFetchEmployeeByIdRequest('333333333335');

          getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444444-name')
            .find('p')
            .click();

          cy.url().should('include', `${ROUTES.departments.path}/view/444444444444`);
        });

        it('should display default values if there is no parent department provided', () => {
          interceptFetchDepartmentsRequest();
          interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
          interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });

          cy.wait('@fetchDepartmentsRequest');

          getTestSelectorByModule(
            Module.departmentManagement,
            SubModule.departmentCatalog,
            'table-body-cell-444444444444-parentDepartmentName'
          )
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

    it('should reset the search state after a new department has been created', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10, search: 'Production' },
        { alias: 'fetchSearchedDepartmentsRequest', fixture: 'department/departments-searched' }
      );
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334] });
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
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
      fillDepartmentDetailsForm({
        name: 'Set Design',
        parentDepartmentId: 444444444446,
        managerId: 333333333333,
      });

      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchCreatedDepartmentsRequest', fixture: 'department/departments-created' }
      );
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444, 444444444446] });
      clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

      cy.wait('@createDepartmentRequest');
      cy.wait('@fetchCreatedDepartmentsRequest');

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'search-departments')
        .find('input')
        .should('have.value', '');
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 5);
    });

    it('should be able to navigate by buttons to the department management page', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
      interceptFetchDepartmentByIdRequest('444444444444');
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
      );

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();
      cy.url().should('include', departmentAdminRoutes[0]);

      cy.visit(ROUTES.departments.path);

      selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444444');
      cy.url().should('include', departmentAdminRoutes[1]);
    });

    it('should not be able to delete a department if the department deletion failed', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
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
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444, 444444444446] });
      interceptDeleteDepartmentRequest('444444444448');

      getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');
      cy.wait('@fetchCreatedDepartmentsRequest');

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 5);

      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10, search: '' },
        { alias: 'fetchDepartmentsRequest', fixture: 'department/departments' }
      );
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
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
    });
  });
});
