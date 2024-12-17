import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getTestSelectorByModule } from '../support/helpers';
import {
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

describe('Branch View Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
    cy.loginMock(true);
  });

  it('should display not found page if the branch was not found', () => {
    interceptFetchBranchByIdFailedRequest('222222222224');
    cy.visit('/manage/branches/view/222222222224');

    cy.get('[data-cy="not-found-page-title"]').should('exist').and('contain.text', 'Page Not Found');
    cy.get('[data-cy="not-found-page-button"]').should('exist').click();
    cy.url().should('include', '/manage/dashboard');
  });

  it('should be able to view the branch and navigate back', () => {
    interceptEditBranchRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();

    getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('exist');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-header').should(
      'have.text',
      'Branch Details'
    );
    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-name').should(
      'have.text',
      'Branch Name'
    );
    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-name').should(
      'have.text',
      'New York Branch'
    );
    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-timeZoneName').should(
      'have.text',
      'TimeZone'
    );
    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-timeZoneName').should(
      'have.text',
      'Eastern Standard Time'
    );

    cy.get('[data-cy="page-title-back-button"]').click();

    cy.url().should('include', '/manage/branches');
    getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
  });

  it('should reset the branch after viewing and navigating back', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();
    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-name').should(
      'have.text',
      'New York Branch'
    );

    cy.get('[data-cy="page-title-back-button"]').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

    // TODO: fix flaky test
    cy.url().should('include', '/manage/branches/new');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').should('have.value', '');
  });

  it('should fetch and display the branch by id when refreshing the page', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit('/manage/branches/view/222222222222');

    cy.reload();

    getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('exist');
    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-name').should(
      'have.text',
      'New York Branch'
    );
  });

  it('should not display the loader if the request resolves quickly', () => {
    interceptFetchBranchByIdRequest('222222222222', 'fetchBranchByIdQuickRequest', 200, 50);
    cy.visit('/manage/branches/view/222222222222');

    getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('not.exist');
    cy.wait('@fetchBranchByIdQuickRequest');
  });
});
