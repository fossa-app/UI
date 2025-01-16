import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getTablePaginationDisplayedRows, getTablePaginationSizeInput, getTestSelectorByModule } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchEmployeesFailedRequest,
  interceptFetchEmployeesRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

describe('Employees Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
    cy.loginMock();
    cy.visit('/manage/employees');
  });

  it('should display the default message within the table if there are no employees', () => {
    interceptFetchEmployeesFailedRequest();

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-layout-title').should('have.text', 'Employees');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-no-employees').should(
      'have.text',
      'No Employees Found'
    );
  });

  it('should display the loader if fetching employees is in progress', () => {
    interceptFetchEmployeesRequest();

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');
    cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-no-employees').should('not.exist');

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('not.exist');
  });

  it('should not display the loader if the request resolves quickly', () => {
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5 },
      { alias: 'fetchEmployeesQuickRequest', fixture: 'employees', statusCode: 200, delay: 50 }
    );

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('not.exist');
  });

  it('should render employees table if there are fetched employees', () => {
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
    );

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');
    cy.wait('@fetchMultipleEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-no-employees').should('not.exist');
    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('not.exist');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 3);
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-header-cell-firstName').should(
      'have.text',
      'First Name'
    );
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-header-cell-lastName').should(
      'have.text',
      'Last Name'
    );
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-header-cell-fullName').should(
      'have.text',
      'Full Name'
    );
    getTablePaginationSizeInput(Module.employeeManagement, SubModule.employeeTable, 'table').should('have.value', '5');
    getTablePaginationDisplayedRows(Module.employeeManagement, SubModule.employeeTable, 'table-pagination').should('have.text', '1–3 of 3');
  });

  it('should send correct request when pagination changes', () => {
    interceptFetchEmployeesRequest();
    cy.wait('@fetchEmployeesRequest');

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-pagination')
      .find('.MuiTablePagination-input')
      .click();

    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

    interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetch10EmployeesRequest' });

    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

    cy.wait('@fetch10EmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');

    getTablePaginationSizeInput(Module.employeeManagement, SubModule.employeeTable, 'table').should('have.value', '10');
  });

  it('should send correct request when search changes', () => {
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
    );

    cy.wait('@fetchMultipleEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 3);

    cy.get('[data-cy="search-employees"]').find('input').clear();
    cy.get('[data-cy="search-employees"]').find('input').type('Anthony');

    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5, search: 'Anthony' },
      { alias: 'fetchSearchedEmployeesRequest', fixture: 'employees' }
    );

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');

    cy.wait('@fetchSearchedEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5&search=Anthony');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 1);

    cy.get('[data-cy="search-employees"]').find('input').clear();
    cy.get('[data-cy="search-employees"]').find('input').type('Joe');

    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5, search: 'Joe' },
      { alias: 'fetchSearchedNoEmployeesRequest', fixture: 'employees-empty' }
    );

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');

    cy.wait('@fetchSearchedNoEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5&search=Joe');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 0);

    cy.get('[data-cy="search-employees"]').find('input').clear();

    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
    );

    getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');
    cy.wait('@fetchMultipleEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 3);
  });

  it('should reset the search state when the clear icon is clicked', () => {
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
    );
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5, search: 'Anthony' },
      { alias: 'fetchSearchedEmployeesRequest', fixture: 'employees' }
    );

    cy.get('[data-cy="search-employees"]').find('input').type('Anthony');

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 1);

    cy.get('[data-cy="search-employees-clear"]').click();

    cy.get('[data-cy="search-employees"]').find('input').should('have.value', '');

    cy.wait('@fetchMultipleEmployeesRequest');

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row').should('have.length', 3);
  });

  it('should not display action column and actions', () => {
    interceptFetchEmployeesRequest();

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-layout-action-button').should('not.exist');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'actions-menu-icon-222222222222').should('not.exist');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'action-view-222222222222').should('not.exist');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'action-edit-222222222222').should('not.exist');
    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'action-delete-222222222222').should('not.exist');
  });
});
