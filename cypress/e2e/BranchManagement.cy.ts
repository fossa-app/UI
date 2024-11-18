import { getTableBodyRow } from '../support/helpers';
import {
  interceptCreateBranchFailedRequest,
  interceptCreateBranchRequest,
  interceptEditBranchFailedRequest,
  interceptEditBranchRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchMultipleBranchesRequest,
  interceptFetchMultipleUpdatedBranchesRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

describe('Branch Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
    cy.loginMock(true);
  });

  it('should display an empty form on branch creation page', () => {
    cy.visit('/manage/branches/new');

    cy.get('[data-cy="branch-name-input"] input').should('not.have.value');

    cy.visit('/manage/branches');
    cy.get('[data-cy="action-button"]').click();

    cy.get('[data-cy="branch-name-input"] input').should('not.have.value');
  });

  it('should not be able to create a new branch if the form is invalid or branch creation failed', () => {
    interceptCreateBranchFailedRequest();
    cy.visit('/manage/branches');

    cy.get('[data-cy="action-button"]').click();
    cy.get('[data-cy="save-branch-button"]').click();

    cy.get('[data-cy="branch-name-input-validation"]').should('exist').and('have.text', 'Branch name is required');

    cy.get('[data-cy="branch-name-input"]').type('New Test Branch');
    cy.get('[data-cy="save-branch-button"]').click();
    cy.wait('@createBranchFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to create a Branch');
    cy.url().should('include', '/manage/branches/new');
  });

  it('should be able to create a new branch and be navigated back to branch table page if the form is valid and branch creation succeeded', () => {
    interceptCreateBranchRequest();
    cy.visit('/manage/branches');

    getTableBodyRow('branch-table').should('have.length', 1);
    cy.get('[data-cy="action-button"]').click();

    cy.get('[data-cy="branch-name-input"]').type('New York');
    cy.get('[data-cy="save-branch-button"]').click();
    interceptFetchMultipleBranchesRequest();
    cy.wait('@createBranchRequest');
    cy.wait('@fetchMultipleBranchesRequest');

    cy.url().should('include', '/manage/branches');
    getTableBodyRow('branch-table').should('have.length', 2);
  });

  it('should not be able to edit the branch if the form is invalid or branch updating failed', () => {
    interceptEditBranchFailedRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    cy.get('[data-cy="edit-222222222222-branch-button"]').click();

    cy.get('[data-cy="branch-name-input"] input').should('have.value', 'London');

    cy.get('[data-cy="branch-name-input"] input').clear();
    cy.get('[data-cy="save-branch-button"]').click();

    cy.get('[data-cy="branch-name-input-validation"]').should('exist').and('have.text', 'Branch name is required');

    cy.get('[data-cy="branch-name-input"] input').type('London Updated');
    cy.get('[data-cy="save-branch-button"]').click();
    cy.wait('@editBranchFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update Branch');
    cy.url().should('include', '/manage/branches/edit/222222222222');
  });

  it('should be able to edit the branch and be navigated back to branch table page if the form is valid and branch updating succeeded', () => {
    interceptEditBranchRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    cy.get('[data-cy="edit-222222222222-branch-button"]').click();

    cy.get('[data-cy="branch-name-input"] input').clear();
    cy.get('[data-cy="branch-name-input"] input').type('London Updated');
    cy.get('[data-cy="save-branch-button"]').click();

    interceptFetchMultipleBranchesRequest();
    cy.wait('@editBranchRequest');

    interceptFetchMultipleUpdatedBranchesRequest();

    cy.url().should('include', '/manage/branches');

    cy.wait('@fetchMultipleUpdatedBranchesRequest');

    getTableBodyRow('branch-table').should('have.length', 2);
    cy.get('[data-cy="branch-table"]')
      .find('[data-cy="table-body-cell-London Updated"]')
      .should('exist')
      .and('have.text', 'London Updated');
  });
});
