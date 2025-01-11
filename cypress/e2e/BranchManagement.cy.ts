import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getLoadingButtonLoadingIcon, getTestSelectorByModule, selectOption } from '../support/helpers';
import {
  interceptCreateBranchFailedRequest,
  interceptCreateBranchRequest,
  interceptEditBranchFailedRequest,
  interceptEditBranchRequest,
  interceptFetchBranchByIdFailedRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
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
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').should('not.have.value');

    cy.visit('/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').should('not.have.value');
  });

  it('should display validation messages if the form is invalid', () => {
    interceptCreateBranchFailedRequest();
    cy.visit('/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'Branch Name is required');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-timeZoneId-validation')
      .should('exist')
      .and('have.text', 'TimeZone is required');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type(
      'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long branch name'
    );
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'The Branch Name must not exceed 50 characters.');
  });

  it('should not be able to create new branch if the form is invalid or branch creation failed', () => {
    interceptCreateBranchFailedRequest();
    cy.visit('/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-layout-title').should('have.text', 'Create Branch');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type('New Test Branch');
    selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/Chicago');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();
    cy.wait('@createBranchFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to create a Branch');
    cy.url().should('include', '/manage/branches/new');
  });

  it('should be able to create new branch and be navigated back to branch table page if the form is valid and branch creation succeeded', () => {
    interceptCreateBranchRequest();
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 1);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type('New York Branch');
    selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').should('contain.text', 'Save');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 5, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
    );
    cy.wait('@createBranchRequest');
    cy.wait('@fetchMultipleBranchesRequest');

    cy.url().should('include', '/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 2);
  });

  it('should display not found page if the branch was not found', () => {
    interceptFetchBranchByIdFailedRequest('222222222224');
    cy.visit('/manage/branches/edit/222222222224');

    cy.get('[data-cy="not-found-page-title"]').should('exist').and('contain.text', 'Page Not Found');
    cy.get('[data-cy="not-found-page-button"]').should('exist').click();
    cy.url().should('include', '/manage/dashboard');
  });

  it('should not be able to edit the branch if the form is invalid or branch updating failed', () => {
    interceptEditBranchFailedRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').click();

    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-layout-title').should('have.text', 'Edit Branch');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name')
      .find('input')
      .should('have.value', 'New York Branch');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').clear();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'Branch Name is required');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').type('Hawaii Branch');
    selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'Pacific/Honolulu');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();
    cy.wait('@editBranchFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update Branch');
    cy.url().should('include', '/manage/branches/edit/222222222222');
  });

  it('should be able to edit the branch and be navigated back to branch table page if the form is valid and branch updating succeeded', () => {
    interceptEditBranchRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').click();

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('exist');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-header').should('have.text', 'Branch Details');
    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').clear();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').type('Anchorage Branch');
    selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/Anchorage');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').should('have.attr', 'disabled');
    getLoadingButtonLoadingIcon(Module.branchManagement, SubModule.branchDetails, 'form-action-button').should('be.visible');

    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 5, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
    );
    cy.wait('@editBranchRequest');
    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 5, search: '' },
      { alias: 'fetchMultipleUpdatedBranchesRequest', fixture: 'branches-multiple-updated' }
    );

    cy.url().should('include', '/manage/branches');

    cy.wait('@fetchMultipleUpdatedBranchesRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 2);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-Anchorage Branch')
      .should('exist')
      .and('have.text', 'Anchorage Branch');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-Alaskan Standard Time')
      .should('exist')
      .and('have.text', 'Alaskan Standard Time');
  });

  it('should be able to navigate back when the back button is clicked', () => {
    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 5, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branches' }
    );
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();
    cy.get('[data-cy="page-title-back-button"]').click();

    cy.url().should('include', '/manage/branches');

    cy.visit('/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').click();
    cy.get('[data-cy="page-title-back-button"]').click();

    cy.url().should('include', '/manage/branches');
    getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('exist');
  });

  it('should reset the branch after editing and navigating back', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-edit-222222222222').click();
    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name')
      .find('input')
      .should('have.value', 'New York Branch');

    cy.get('[data-cy="page-title-back-button"]').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    // TODO: fix flaky test
    cy.url().should('include', '/manage/branches/new');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').should('have.value', '');
  });

  it('should fetch and display the branch by id when refreshing the page', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches/edit/222222222222');

    cy.reload();

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('exist');
    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name')
      .find('input')
      .should('have.value', 'New York Branch');
  });

  it('should not display the loader if the request resolves quickly', () => {
    interceptFetchBranchByIdRequest('222222222222', 'fetchBranchByIdQuickRequest', 200, 50);
    cy.visit('/manage/branches/edit/222222222222');

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('not.exist');
    cy.wait('@fetchBranchByIdQuickRequest');
  });
});
