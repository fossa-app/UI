import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  getTestSelectorByModule,
  clickSubFlow,
  checkIsSubFlowDisabled,
  checkIsSubFlowHasDisabledAttribute,
  clickFlowsIcon,
} from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchProfileRequest,
  interceptFetchCompanyLicenseRequest,
  interceptDeleteCompanyFailedRequest,
  interceptDeleteCompanyRequest,
  interceptDeleteProfileFailedRequest,
  interceptDeleteProfileRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchProfileFailedRequest,
} from '../support/interceptors';

describe('Offboarding Flow Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
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
    const isAdminRole = role === 'Admin';

    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should be redirected to the Delete Company page', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.offboarding.path);

        cy.url().should('include', ROUTES.deleteCompany.path);
        getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-header').should('have.text', 'Delete Company');
        getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-action-button')
          .should('exist')
          .and('have.text', 'Delete Company');

        if (isAdminRole) {
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-general-validation-message').should('not.exist');
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-general-validation-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
        }
      });

      it('should be redirected to the Delete Profile page', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.employeeOffboarding.path);

        cy.url().should('include', ROUTES.deleteEmployee.path);
        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-header').should('have.text', 'Delete Profile');
        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-action-button')
          .should('exist')
          .and('have.text', 'Delete Profile');

        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-general-validation-message').should('not.exist');
        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-action-button').should('not.have.attr', 'disabled');
      });

      it('should be able to navigate to the Delete Profile page if the employee offboarding subflow is clicked', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        checkIsSubFlowDisabled('Employee Offboarding', false);
        clickSubFlow('Employee Offboarding');

        cy.url().should('include', ROUTES.deleteEmployee.path);
      });

      it('should not be redirected to the Flows page if the profile deletion failed', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptDeleteProfileFailedRequest();
        cy.visit(ROUTES.flows.path);

        clickSubFlow('Employee Offboarding');

        clickActionButton(Module.deleteEmployee, SubModule.employeeDetails);
        cy.wait('@deleteProfileFailedRequest');

        cy.url().should('include', ROUTES.deleteEmployee.path);
        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
          .should('exist')
          .and('contain.text', 'Unable to delete the Profile. It has dependent entities');

        clickFlowsIcon();

        checkIsSubFlowDisabled('Employee Offboarding', false);
        checkIsSubFlowDisabled('Employee Onboarding', true);
      });

      it('should be redirected to the Flows page if the profile deletion succeeded', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptDeleteProfileRequest();
        cy.visit(ROUTES.flows.path);

        clickSubFlow('Employee Offboarding');

        clickActionButton(Module.deleteEmployee, SubModule.employeeDetails);
        cy.wait('@deleteProfileRequest');

        cy.location('pathname').should('eq', ROUTES.flows.path);
        getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
          .should('exist')
          .and('contain.text', 'Profile has been successfully deleted');

        checkIsSubFlowDisabled('Company Onboarding', true);
        checkIsSubFlowDisabled('View Company', false);
        checkIsSubFlowDisabled('Company Offboarding', false);
        checkIsSubFlowDisabled('Branches', true);
        checkIsSubFlowDisabled('Departments', true);
        checkIsSubFlowDisabled('Employees', true);
        checkIsSubFlowDisabled('Employee Onboarding', false);
        checkIsSubFlowDisabled('View Profile', true);
        checkIsSubFlowDisabled('Employee Offboarding', true);
      });

      it('should not be able to manually navigate to the View Profile or Edit Profile page, if the profile has been deleted', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        interceptDeleteProfileRequest();
        cy.visit(ROUTES.flows.path);

        clickSubFlow('Employee Offboarding');

        clickActionButton(Module.deleteEmployee, SubModule.employeeDetails);
        cy.wait('@deleteProfileRequest');

        cy.location('pathname').should('eq', ROUTES.flows.path);

        [ROUTES.viewProfile.path, ROUTES.editProfile.path].forEach((route) => {
          interceptFetchProfileFailedRequest();
          cy.visit(route);
          cy.wait('@fetchProfileFailedRequest');
          cy.location('pathname').should('eq', ROUTES.flows.path);
        });
      });
    });
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
    });

    it('should disable the company offboarding subflow', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileRequest();
      cy.visit(ROUTES.flows.path);

      checkIsSubFlowHasDisabledAttribute('Company Offboarding', true);
      clickSubFlow('Company Offboarding');

      cy.location('pathname').should('eq', ROUTES.flows.path);
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should be able to navigate to the Delete Company page if the company offboarding subflow is clicked', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileRequest();
      cy.visit(ROUTES.flows.path);

      checkIsSubFlowHasDisabledAttribute('Company Offboarding', false);
      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.deleteCompany.path);
    });

    it('should not be redirected to the Flows page if the company deletion failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileRequest();
      interceptDeleteCompanyFailedRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      clickActionButton(Module.deleteCompany, SubModule.companyDetails);
      cy.wait('@deleteCompanyFailedRequest');

      cy.url().should('include', ROUTES.deleteCompany.path);
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Unable to delete the Company. It has dependent entities');

      clickFlowsIcon();

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', true);
    });

    it('should be redirected to the Flows page if the company deletion succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileRequest();
      interceptDeleteCompanyRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      clickActionButton(Module.deleteCompany, SubModule.companyDetails);
      cy.wait('@deleteCompanyRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company has been successfully deleted');

      checkIsSubFlowDisabled('Company Onboarding', false);
      checkIsSubFlowDisabled('View Company', true);
      checkIsSubFlowDisabled('Company Offboarding', true);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', true);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', true);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);
    });

    it('should not be able to manually navigate to the View Company or Edit Company page, if the company has been deleted', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileRequest();
      interceptDeleteCompanyRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      clickActionButton(Module.deleteCompany, SubModule.companyDetails);
      cy.wait('@deleteCompanyRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);

      [ROUTES.viewCompany.path, ROUTES.editCompany.path].forEach((route) => {
        interceptFetchCompanyFailedRequest();
        cy.visit(route);
        cy.wait('@fetchCompanyFailedRequest');
        cy.location('pathname').should('eq', ROUTES.flows.path);
      });
    });
  });
});
