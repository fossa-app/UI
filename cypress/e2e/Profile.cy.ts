import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getLoadingButtonLoadingIcon, getTestSelectorByModule, openUserProfile } from '../support/helpers';
import {
  interceptEditEmployeeFailedRequest,
  interceptEditEmployeeRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeFailedRequest,
  interceptFetchEmployeeRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

describe('Profile Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    cy.loginMock();
  });

  it('should not be able to navigate to profile page if the employee is in a draft status', () => {
    interceptFetchEmployeeFailedRequest();
    cy.visit('/setup/employee');

    cy.wait('@fetchEmployeeFailedRequest');
    openUserProfile();

    cy.url().should('include', '/setup/employee');

    cy.visit('/manage/profile/view');

    cy.url().should('include', '/setup/employee');
  });

  it('should navigate to view profile page if the employee exists when clicking the user menu item', () => {
    interceptFetchEmployeeRequest();
    cy.visit('/manage/company/view');

    cy.wait('@fetchEmployeeRequest');
    openUserProfile();

    cy.url().should('include', '/manage/profile/view');
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-header').should('have.text', 'Profile Details');
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-label-firstName').should(
      'have.text',
      'First Name'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-value-firstName').should(
      'have.text',
      'Gabriel'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-label-lastName').should(
      'have.text',
      'Last Name'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-value-lastName').should(
      'have.text',
      'Archangel'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-label-fullName').should(
      'have.text',
      'Full Name'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-value-fullName').should(
      'have.text',
      'Gabriel Admin Archangel'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').should('exist');
  });

  it('should reset the form and navigate to view profile page if the cancel button is clicked', () => {
    interceptFetchEmployeeRequest();
    cy.visit('/manage/profile/view');

    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

    cy.url().should('include', '/manage/profile/edit');

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').type('Aziraphale');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Fell');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Aziraphale User Fell');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-cancel-button').should('exist').click();

    cy.url().should('include', '/manage/profile/view');

    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-header').should('have.text', 'Profile Details');

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').should('have.value', 'Gabriel');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName')
      .find('input')
      .should('have.value', 'Archangel');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName')
      .find('input')
      .should('have.value', 'Gabriel Admin Archangel');
  });

  it('should not be able to edit the profile if the form is invalid or employee updating failed', () => {
    interceptFetchEmployeeRequest();
    interceptEditEmployeeFailedRequest();
    cy.visit('/manage/profile/view');

    cy.wait('@fetchEmployeeRequest');

    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').should('not.have.attr', 'disabled');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName-validation')
      .should('exist')
      .and('have.text', 'First Name is required');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName-validation')
      .should('exist')
      .and('have.text', 'Last Name is required');

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName')
      .find('input')
      .type('Fail Employee First Name');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Fail Employee Last Name');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Fail Employee Full Name');

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').click();

    cy.wait('@editEmployeeFailedRequest');

    cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update Employee');
  });

  it('should be able to edit the profile and be navigated to view profile page if the form is valid and employee updating succeeded', () => {
    interceptFetchEmployeeRequest();
    interceptEditEmployeeRequest();
    cy.visit('/manage/profile/view');

    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

    cy.url().should('include', '/manage/profile/edit');

    cy.wait('@fetchEmployeeRequest');

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').type('Anthony');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Crowley');
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();
    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Anthony User Crowley');

    interceptFetchEmployeeRequest('fetchUpdatedEmployeeRequest', 'employee-updated');

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').click();

    getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').should('have.attr', 'disabled');
    getLoadingButtonLoadingIcon(Module.profile, SubModule.profileDetails, 'form-action-button').should('be.visible');
    getLinearLoader(Module.profile, SubModule.profileViewDetails, 'view-details').should('exist');

    cy.wait('@editEmployeeRequest');
    cy.wait('@fetchUpdatedEmployeeRequest');

    cy.url().should('include', '/manage/profile/view');
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-value-firstName').should(
      'have.text',
      'Anthony'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-value-lastName').should(
      'have.text',
      'Crowley'
    );
    getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-item-value-fullName').should(
      'have.text',
      'Anthony User Crowley'
    );

    cy.get('[data-cy="user-avatar"]').click();
    cy.get('[data-cy="user-name"]').should('exist').and('have.text', 'Hi, Anthony');
  });
});
