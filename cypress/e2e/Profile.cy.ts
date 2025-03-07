import { Module, SubModule } from '../../src/shared/models';
import {
  clickActionButton,
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  openUserProfile,
  verifyTextFields,
} from '../support/helpers';
import {
  interceptEditProfileFailedRequest,
  interceptEditProfileRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileFailedRequest,
  interceptFetchProfileRequest,
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

  const roles = [
    {
      role: 'User',
      loginMock: () => cy.loginMock(),
    },
    {
      role: 'Admin',
      loginMock: () => cy.loginMock(true),
    },
  ];

  roles.forEach(({ role, loginMock }) => {
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should not be able to navigate to profile page if the employee is in a draft status', () => {
        interceptFetchProfileFailedRequest();
        cy.visit('/setup/employee');

        cy.wait('@fetchProfileFailedRequest');
        openUserProfile();

        cy.url().should('include', '/setup/employee');

        cy.visit('/manage/profile/view');

        cy.url().should('include', '/setup/employee');
      });

      it('should navigate to view profile page if the employee exists when clicking the user menu item', () => {
        interceptFetchProfileRequest();
        cy.visit('/manage/company/view');

        cy.wait('@fetchProfileRequest');
        openUserProfile();

        cy.url().should('include', '/manage/profile/view');
        verifyTextFields(Module.profile, SubModule.profileViewDetails, {
          'view-details-header': 'Profile Details',
          'view-details-section-basicInfo': 'Basic Information',
          'view-details-label-firstName': 'First Name',
          'view-details-value-firstName': 'Gabriel',
          'view-details-label-lastName': 'Last Name',
          'view-details-value-lastName': 'Archangel',
          'view-details-label-fullName': 'Full Name',
          'view-details-value-fullName': 'Gabriel Admin Archangel',
        });
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').should('exist');
      });

      it('should reset the form and navigate to view profile page if the cancel button is clicked', () => {
        interceptFetchProfileRequest();
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

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName')
          .find('input')
          .should('have.value', 'Gabriel');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName')
          .find('input')
          .should('have.value', 'Archangel');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName')
          .find('input')
          .should('have.value', 'Gabriel Admin Archangel');
      });

      // TODO: flaky test
      it('should not be able to edit the profile if the form is invalid or employee updating failed', () => {
        interceptFetchProfileRequest();
        interceptEditProfileFailedRequest();
        cy.visit('/manage/profile/view');

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').should('not.have.attr', 'disabled');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();

        clickActionButton(Module.profile, SubModule.profileDetails);

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName-validation')
          .should('exist')
          .and('have.text', 'First Name is required');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName-validation')
          .should('exist')
          .and('have.text', 'Last Name is required');

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName')
          .find('input')
          .type('Fail Employee First Name');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName')
          .find('input')
          .type('Fail Employee Last Name');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName')
          .find('input')
          .type('Fail Employee Full Name');

        clickActionButton(Module.profile, SubModule.profileDetails);

        cy.wait('@editProfileFailedRequest');

        cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update the Profile');
      });

      it('should be able to edit the profile and be navigated to view profile page if the form is valid and employee updating succeeded', () => {
        interceptFetchProfileRequest();
        interceptEditProfileRequest();
        cy.visit('/manage/profile/view');

        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

        cy.url().should('include', '/manage/profile/edit');

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').type('Anthony');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Crowley');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Anthony User Crowley');

        interceptFetchProfileRequest('fetchUpdatedProfileRequest', 'employee-updated');

        clickActionButton(Module.profile, SubModule.profileDetails);

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-action-button').should('have.attr', 'disabled');
        getLoadingButtonLoadingIcon(Module.profile, SubModule.profileDetails, 'form-action-button').should('be.visible');
        getLinearLoader(Module.profile, SubModule.profileViewDetails, 'view-details').should('exist');

        cy.wait('@editProfileRequest');
        cy.wait('@fetchUpdatedProfileRequest');

        cy.url().should('include', '/manage/profile/view');
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-value-firstName').should(
          'have.text',
          'Anthony'
        );
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-value-lastName').should('have.text', 'Crowley');
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-value-fullName').should(
          'have.text',
          'Anthony User Crowley'
        );
        cy.get('[data-cy="success-snackbar"]').should('exist').and('contain.text', 'Profile has been successfully updated');

        cy.get('[data-cy="user-avatar"]').click();
        cy.get('[data-cy="user-name"]').should('exist').and('have.text', 'Hi, Anthony');
      });

      it('should render the danger zone on the view profile page', () => {
        interceptFetchProfileRequest();
        cy.visit('/manage/profile/view');

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-title').should('not.exist');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-subtitle').should('not.exist');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-button').should('not.exist');

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-details-header')
          .should('have.text', 'Danger Zone')
          .click();

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-title')
          .should('exist')
          .and('have.text', 'Delete Profile');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-subtitle')
          .should('exist')
          .and('have.text', 'Once you delete your profile, there is no going back. Please be certain.');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-button').should('exist');
      });

      it('should display the delete confirmation popup when delete profile button is clicked', () => {
        interceptFetchProfileRequest();
        cy.visit('/manage/profile/view');

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-details-header').click();
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-button').click();

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog').should('exist');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog-title')
          .should('exist')
          .and('have.text', 'Delete Profile');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog-content-text')
          .should('exist')
          .and('have.text', 'Once you delete your profile, there is no going back. Please be certain.');
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog-cancel-button')
          .should('exist')
          .and('have.text', 'Cancel')
          .click();

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog').should('not.exist');

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'view-action-button').click();
        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog-action-button')
          .should('exist')
          .and('have.text', 'Acknowledge')
          .click();

        getTestSelectorByModule(Module.profile, SubModule.profileViewSettings, 'dialog').should('not.exist');
        cy.get('[data-cy="success-snackbar"]').should('exist').and('contain.text', 'Profile has been successfully deleted');
      });
    });
  });
});
