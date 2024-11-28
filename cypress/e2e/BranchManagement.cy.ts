import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getTestSelectorByModule } from '../support/helpers';
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

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type(
      'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long branch name'
    );
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'The Branch Name must not exceed 50 characters.');
  });

  it('should not be able to create a new branch if the form is invalid or branch creation failed', () => {
    interceptCreateBranchFailedRequest();
    cy.visit('/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-layout-title').should('have.text', 'Create Branch');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type('New Test Branch');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();
    cy.wait('@createBranchFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to create a Branch');
    cy.url().should('include', '/manage/branches/new');
  });

  it('should be able to create a new branch and be navigated back to branch table page if the form is valid and branch creation succeeded', () => {
    interceptCreateBranchRequest();
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 1);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type('New York');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    interceptFetchBranchesRequest(1, 5, 'fetchMultipleBranchesRequest', 'branches-multiple');
    cy.wait('@createBranchRequest');
    cy.wait('@fetchMultipleBranchesRequest');

    cy.url().should('include', '/manage/branches');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 2);
  });

  it('should not be able to edit the branch if the form is invalid or branch updating failed', () => {
    interceptEditBranchFailedRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'edit-222222222222-branch-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-layout-title').should('have.text', 'Edit Branch');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name')
      .find('input')
      .should('have.value', 'London');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').clear();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'Branch Name is required');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').type('London Updated');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();
    cy.wait('@editBranchFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update Branch');
    cy.url().should('include', '/manage/branches/edit/222222222222');
  });

  it('should be able to edit the branch and be navigated back to branch table page if the form is valid and branch updating succeeded', () => {
    interceptEditBranchRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'edit-222222222222-branch-button').click();

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('not.have.css', 'visibility', 'hidden');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').clear();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').type('London Updated');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button').should('have.attr', 'disabled');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-action-button')
      .find('.MuiLoadingButton-loadingIndicator')
      .should('exist')
      .and('be.visible');

    interceptFetchBranchesRequest(1, 5, 'fetchMultipleBranchesRequest', 'branches-multiple');
    cy.wait('@editBranchRequest');
    interceptFetchBranchesRequest(1, 5, 'fetchMultipleUpdatedBranchesRequest', 'branches-multiple-updated');

    cy.url().should('include', '/manage/branches');

    cy.wait('@fetchMultipleUpdatedBranchesRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row').should('have.length', 2);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-cell-London Updated')
      .should('exist')
      .and('have.text', 'London Updated');
  });
});
