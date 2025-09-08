import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  openUserProfile,
  verifyFormValidationMessages,
  verifyTextFields,
} from 'support/helpers';
import {
  interceptEditProfileFailedRequest,
  interceptEditProfileFailedWithErrorRequest,
  interceptEditProfileRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchProfileFailedRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from 'support/interceptors';

describe('Profile Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
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

      it('should not be able to navigate to the profile page if the employee is in a draft status', () => {
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.employeeOnboarding.path);

        cy.wait('@fetchProfileFailedRequest');
        openUserProfile();

        cy.location('pathname').should('eq', ROUTES.createEmployee.path);

        cy.visit(ROUTES.viewProfile.path);

        cy.location('pathname').should('eq', ROUTES.flows.path);
      });

      it('should navigate to view profile page if the employee exists when clicking the profile menu item', () => {
        interceptFetchProfileRequest();
        cy.visit(ROUTES.viewCompany.path);

        cy.wait('@fetchProfileRequest');
        openUserProfile();

        cy.url().should('include', ROUTES.viewProfile.path);
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
        cy.visit(ROUTES.viewProfile.path);

        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

        cy.url().should('include', ROUTES.editProfile.path);

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').type('Aziraphale');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Fell');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Aziraphale User Fell');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-cancel-button').should('exist').click();

        cy.url().should('include', ROUTES.viewProfile.path);

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

      it('should not be able to edit the profile if the form is invalid or employee update failed', () => {
        interceptFetchProfileRequest();
        interceptEditProfileFailedRequest();
        cy.visit(ROUTES.viewProfile.path);

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-submit-button').should('not.have.attr', 'disabled');
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

        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
          .should('exist')
          .and('contain.text', 'Failed to update the Profile');
      });

      it('should display async validation messages if the profile update failed with validation errors', () => {
        interceptFetchProfileRequest();
        interceptEditProfileFailedWithErrorRequest();
        cy.visit(ROUTES.editProfile.path);

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').type('Joe');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Joe');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Joe Joe');

        clickActionButton(Module.profile, SubModule.profileDetails);

        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
          .should('exist')
          .and('contain.text', 'Failed to update the Profile');
        verifyFormValidationMessages(Module.profile, SubModule.profileDetails, [
          {
            field: 'form-field-lastName-validation',
            message: `'First Name' and 'Last Name' cannot be the same.`,
          },
        ]);
        cy.url().should('include', ROUTES.editProfile.path);
      });

      it('should be able to edit the profile and be navigated to view profile page if the form is valid and employee update succeeded', () => {
        interceptFetchProfileRequest();
        interceptEditProfileRequest();
        cy.visit(ROUTES.viewProfile.path);

        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-action-button').click();

        cy.url().should('include', ROUTES.editProfile.path);

        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-firstName').find('input').type('Anthony');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-lastName').find('input').type('Crowley');
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').clear();
        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-field-fullName').find('input').type('Anthony User Crowley');

        interceptFetchProfileRequest('fetchUpdatedProfileRequest', 'employee/employee-updated');

        clickActionButton(Module.profile, SubModule.profileDetails);

        getTestSelectorByModule(Module.profile, SubModule.profileDetails, 'form-submit-button').should('have.attr', 'disabled');
        getLoadingButtonLoadingIcon(Module.profile, SubModule.profileDetails, 'form-submit-button').should('be.visible');
        getLinearLoader(Module.profile, SubModule.profileViewDetails, 'view-details').should('exist');

        cy.wait('@editProfileRequest');
        cy.wait('@fetchUpdatedProfileRequest');

        cy.url().should('include', ROUTES.viewProfile.path);
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-value-firstName').should(
          'have.text',
          'Anthony'
        );
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-value-lastName').should('have.text', 'Crowley');
        getTestSelectorByModule(Module.profile, SubModule.profileViewDetails, 'view-details-value-fullName').should(
          'have.text',
          'Anthony User Crowley'
        );
        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
          .should('exist')
          .and('contain.text', 'Profile has been successfully updated');

        getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();
        getTestSelectorByModule(Module.shared, SubModule.header, 'profile-name').should('exist').and('have.text', 'Hi, Anthony');
      });
    });
  });
});
