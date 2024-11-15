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

    cy.get('[data-cy="table-no-employees"]').should('not.exist');
    cy.get('[data-cy="linear-loader"]').should('not.exist');
    interceptFetchEmployeesRequest();
    cy.wait('@fetchEmployeesRequest');
    cy.get('[data-cy="linear-loader"]').should('exist');
  });

  it('should display employees within the table if there are employees', () => {
    interceptFetchEmployeesRequest();

    cy.get('[data-cy="table-no-employees"]').should('not.exist');
    cy.get('[data-cy="linear-loader"]').should('not.exist');
    cy.get('[data-cy="table-body-row"]').should('have.length', 3);
  });
});
