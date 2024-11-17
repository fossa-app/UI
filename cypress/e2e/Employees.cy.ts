import { getTableLoader, getTablePaginationDisplayedRows, getTablePaginationSizeInput } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
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
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
    cy.loginMock();
    cy.visit('/manage/employees');
  });

  it('should display the default message within the table if there are no employees', () => {
    interceptFetchEmployeesFailedRequest();

    cy.get('[data-cy="table-layout-title"]').should('have.text', 'Employees');
    cy.get('[data-cy="table-no-employees"]').should('have.text', 'No Employees Found');
  });

  it('should display the loader if fetching employees is in progress', () => {
    interceptFetchEmployeesRequest();

    cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');
    getTableLoader('employee-table').should('not.have.css', 'visibility', 'hidden');
    cy.get('[data-cy="table-no-employees"]').should('not.exist');

    getTableLoader('employee-table').should('have.css', 'visibility', 'hidden');
  });

  it('should render employees table if there are fetched employees', () => {
    interceptFetchEmployeesRequest();

    cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');
    cy.get('[data-cy="table-no-employees"]').should('not.exist');
    getTableLoader('employee-table').should('not.have.css', 'visibility', 'hidden');
    cy.get('[data-cy="table-body-row"]').should('have.length', 3);
    cy.get('[data-cy="employee-table"]').find('[data-cy="table-header-cell-firstName"]').should('have.text', 'First Name');
    cy.get('[data-cy="employee-table"]').find('[data-cy="table-header-cell-lastName"]').should('have.text', 'Last Name');
    cy.get('[data-cy="employee-table"]').find('[data-cy="table-header-cell-fullName"]').should('have.text', 'Full Name');
    getTablePaginationSizeInput('employee-table').should('have.value', '5');
    getTablePaginationDisplayedRows('employee-table').should('have.text', '1–3 of 3');
  });

  it('should send correct request when pagination changes', () => {
    interceptFetchEmployeesRequest();
    cy.wait('@fetchEmployeesRequest');

    cy.get('[data-cy="employee-table"]').find('[data-cy="table-pagination"] .MuiTablePagination-input').click();

    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

    interceptFetchEmployeesRequest(1, 10, 'fetch10EmployeesRequest');

    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

    cy.wait('@fetch10EmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');

    getTablePaginationSizeInput('employee-table').should('have.value', '10');
  });
});
