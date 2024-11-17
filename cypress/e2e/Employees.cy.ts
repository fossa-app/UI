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
    cy.visit('/manage/employees');
    interceptFetchEmployeesRequest();

    cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');
    getTableLoader().should('be.visible');
    cy.get('[data-cy="table-no-employees"]').should('not.exist');

    cy.wait('@fetchEmployeesRequest');

    getTableLoader().should('not.be.visible');
  });

  it('should render employees table if there are fetched employees', () => {
    interceptFetchEmployeesRequest();

    cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=5');
    cy.get('[data-cy="table-no-employees"]').should('not.exist');
    getTableLoader().should('not.be.visible');
    cy.get('[data-cy="table-body-row"]').should('have.length', 3);
    cy.get('[data-cy="employees-table"]').find('[data-cy="table-header-cell-firstName"]').should('have.text', 'First Name');
    cy.get('[data-cy="employees-table"]').find('[data-cy="table-header-cell-lastName"]').should('have.text', 'Last Name');
    cy.get('[data-cy="employees-table"]').find('[data-cy="table-header-cell-fullName"]').should('have.text', 'Full Name');
    getTablePaginationSizeInput().should('have.value', '5');
    getTablePaginationDisplayedRows().should('have.text', '1–3 of 3');
  });

  it('should send correct request when pagination changes', () => {
    cy.get('[data-cy="employees-table"]').find('[data-cy="table-pagination"] .MuiTablePagination-input').click();

    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').should('have.length', 2);
    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(0).should('have.text', '5');
    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem').eq(1).should('have.text', '10');

    interceptFetchEmployeesRequest(0, 1, 10);

    cy.get('.MuiMenu-paper').find('.MuiTablePagination-menuItem[data-value="10"]').click();

    cy.wait('@fetchEmployeesRequest').its('request.url').should('include', 'Employees?pageNumber=1&pageSize=10');

    getTablePaginationSizeInput().should('have.value', '10');
  });
});
