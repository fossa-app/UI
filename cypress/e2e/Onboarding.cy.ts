import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  clickField,
  fillBranchDetailsForm,
  getTestSelectorByModule,
  selectOption,
  verifyNotExist,
  verifyOptions,
  verifyFormValidationMessages,
  verifyTextFields,
  clickSubFlow,
} from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchBranchesFailedRequest,
  interceptFetchProfileFailedRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchProfileRequest,
  interceptCreateCompanyFailedRequest,
  interceptCreateCompanyRequest,
  interceptCreateBranchFailedRequest,
  interceptCreateBranchRequest,
  interceptCreateProfileFailedRequest,
  interceptCreateProfileRequest,
  interceptCreateBranchFailedWithErrorRequest,
  interceptCreateProfileFailedWithErrorRequest,
  interceptCreateCompanyFailedWithErrorRequest,
} from '../support/interceptors';

const companyOnboardingRoutes = [ROUTES.setupCompany.path, ROUTES.setupBranch.path];
const employeeOnboardingRoutes = [ROUTES.setupEmployee.path];

describe('Onboarding Flow Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
  });

  const roles = [
    {
      role: 'User',
      loginMock: () => cy.loginMock(),
      firstName: 'Anthony',
      lastName: 'Crowley',
      fullName: 'Anthony User Crowley',
    },
    {
      role: 'Admin',
      loginMock: () => cy.loginMock(true),
      firstName: 'Gabriel',
      lastName: 'Archangel',
      fullName: 'Gabriel Admin Archangel',
    },
  ];

  roles.forEach(({ role, loginMock, firstName, lastName, fullName }) => {
    const isAdminRole = role === 'Admin';

    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should navigate to Company setup page and no other setup page if there is no company', () => {
        interceptFetchCompanyFailedRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.wait('@fetchCompanyFailedRequest');

        cy.url().should('include', ROUTES.setupCompany.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-general-validation-message').should('not.exist');
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-general-validation-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
        }

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.setupCompany.path);
        });
        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.flows.path);
        });
      });

      it('should navigate to the Branch setup page and no other setup page if company exists', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.url().should('include', ROUTES.setupBranch.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-general-validation-message').should('not.exist');
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').should('have.attr', 'disabled');
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-general-validation-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
        }

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.setupBranch.path);
        });
        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.flows.path);
        });
      });

      it('should navigate to the Employee setup page and no other setup page if company and branch exist', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.employeeOnbarding.path);

        cy.wait('@fetchCompanyRequest');
        cy.wait('@fetchBranchesFailedRequest');
        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', ROUTES.setupEmployee.path);
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').should('not.have.attr', 'disabled');
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-general-validation-message').should('not.exist');
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').should('contain.text', 'Finish');
        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.flows.path);
        });
        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.setupEmployee.path);
        });
      });

      it('should not be able to navigate to the Profile page if employee creation failed', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        interceptCreateProfileFailedRequest();
        cy.visit(ROUTES.employeeOnbarding.path);

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', ROUTES.setupEmployee.path);

        clickActionButton(Module.employeeSetup, SubModule.employeeDetails);

        cy.wait('@createProfileFailedRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');
        cy.url().should('include', ROUTES.setupEmployee.path);
      });

      it('should be able to navigate to the Flows page if the employee creation succeeded', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        interceptCreateProfileRequest();
        cy.visit(ROUTES.employeeOnbarding.path);

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', ROUTES.setupEmployee.path);
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-header').should('have.text', 'Employee Details');
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-section-field-basicInfo').should(
          'have.text',
          'Basic Information'
        );

        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').type(firstName);
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').type(lastName);
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').type(fullName);

        interceptFetchProfileRequest();
        clickActionButton(Module.employeeSetup, SubModule.employeeDetails);

        cy.wait('@createProfileRequest');
        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('not.have.attr', 'disabled');
        cy.url().should('include', ROUTES.flows.path);
      });

      it('should be able to navigate to the Company page by clicking the company logo if the company has been created', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.setupEmployee.path);

        cy.wait('@fetchProfileFailedRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo').should('exist').click();

        cy.url().should('include', ROUTES.viewCompany.path);
      });

      it('should navigate to the Flows page if the company, branch and employee data exist', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.wait('@fetchCompanyRequest');
        cy.wait('@fetchBranchesRequest');
        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('not.have.attr', 'disabled');
        cy.url().should('include', ROUTES.flows.path);
      });
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should display validation messages if the company creation form is invalid', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      clickActionButton(Module.companySetup, SubModule.companyDetails);

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'Company Name is required');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-countryCode-validation')
        .should('exist')
        .and('have.text', 'Country is required');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type(
        'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long company name'
      );

      clickActionButton(Module.companySetup, SubModule.companyDetails);

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'The Company Name must not exceed 50 characters.');
    });

    it('should not be able to navigate to branch setup step if the company creation failed', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', ROUTES.setupCompany.path);

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Test Company');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'UA');
      clickActionButton(Module.companySetup, SubModule.companyDetails);

      cy.wait('@createCompanyFailedRequest');

      cy.url().should('include', ROUTES.setupCompany.path);
    });

    it('should display async validation messages if the company creation failed with validation errors', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedWithErrorRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').find('input').type('Good Omens Updated');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'DE');

      clickActionButton(Module.companySetup, SubModule.companyDetails);

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to create a Company');
      verifyFormValidationMessages(Module.companySetup, SubModule.companyDetails, [
        {
          field: 'form-field-name-validation',
          message: `Company 'Good Omens Updated' already exists in the system.`,
        },
      ]);
      cy.url().should('include', ROUTES.setupCompany.path);
    });

    it('should be able to navigate to branch setup step if the company creation succeeded', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyRequest();
      interceptFetchBranchesFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', ROUTES.setupCompany.path);
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-header').should('have.text', 'Company Details');
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-section-field-basicInfo').should(
        'have.text',
        'Basic Information'
      );
      getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo').should('not.exist');
      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

      interceptFetchCompanyRequest();

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.companySetup, SubModule.companyDetails);

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.setupBranch.path);
      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');
      getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo').should('exist').and('have.text', 'Good Omens');
    });

    it('should display only available timezones for selected company country', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyRequest();
      cy.visit(ROUTES.onboarding.path);

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('US Company');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.companySetup, SubModule.companyDetails);

      interceptFetchCompanyRequest();

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.setupBranch.path);
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-timeZoneId').click();

      verifyOptions(Module.branchSetup, SubModule.branchDetails, 'form-field-timeZoneId-option', [
        'Pacific/Honolulu',
        'America/Anchorage',
        'America/New_York',
        'America/Chicago',
      ]);
    });

    it('should display validation messages if the branch creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit(ROUTES.companyOnboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      verifyFormValidationMessages(Module.branchSetup, SubModule.branchDetails, [
        { field: 'form-field-name-validation', message: 'Branch Name is required' },
        { field: 'form-field-timeZoneId-validation', message: 'TimeZone is required' },
        { field: 'form-field-address.line1-validation', message: 'Address Line 1 is required' },
        { field: 'form-field-address.city-validation', message: 'City is required' },
        { field: 'form-field-address.countryCode-validation', message: 'Country is required' },
        { field: 'form-field-address.subdivision-validation', message: 'State is required' },
        { field: 'form-field-address.postalCode-validation', message: 'Postal Code is required' },
      ]);

      fillBranchDetailsForm(Module.branchSetup, SubModule.branchDetails, {
        name: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long branch name',
        timeZoneId: 'America/Chicago',
        address: {
          line1: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long address line 1',
          line2: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long address line 2',
          city: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long city',
          subdivision: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long state',
          postalCode: 'long postal code',
          countryCode: 'US',
        },
      });

      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      verifyFormValidationMessages(Module.branchSetup, SubModule.branchDetails, [
        { field: 'form-field-name-validation', message: 'The Branch Name must not exceed 50 characters.' },
        { field: 'form-field-address.line1-validation', message: 'Address Line 1 must not exceed 50 characters.' },
        { field: 'form-field-address.line2-validation', message: 'Address Line 2 must not exceed 50 characters.' },
        { field: 'form-field-address.city-validation', message: 'City must not exceed 50 characters.' },
        { field: 'form-field-address.subdivision-validation', message: 'State must not exceed 50 characters.' },
        { field: 'form-field-address.postalCode-validation', message: 'Postal Code must not exceed 10 characters.' },
      ]);

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-address.postalCode').find('input').clear();
      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-address.postalCode').find('input').type('12');

      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-address.postalCode-validation')
        .should('exist')
        .and('have.text', 'Postal Code must be at least 4 characters long.');

      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      verifyNotExist(Module.branchSetup, SubModule.branchDetails, [
        'form-field-address.line1-validation',
        'form-field-address.line2-validation',
        'form-field-address.city-validation',
        'form-field-address.subdivision-validation',
        'form-field-address.postalCode-validation',
      ]);
    });

    it('should display async validation messages if the branch creation failed with validation errors', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateBranchFailedWithErrorRequest();
      cy.visit(ROUTES.companyOnboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      fillBranchDetailsForm(Module.branchSetup, SubModule.branchDetails, {
        name: 'Hawaii Branch',
        timeZoneId: 'Pacific/Honolulu',
        address: {
          line1: '3211 Dewert Ln',
          line2: '',
          city: 'Honolulu',
          subdivision: 'HI',
          postalCode: '*****',
          countryCode: 'US',
        },
      });

      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to create a Branch');
      verifyFormValidationMessages(Module.branchSetup, SubModule.branchDetails, [
        { field: 'form-section-field-address-validation', message: 'Value is provided however is not valid' },
        {
          field: 'form-field-address.postalCode-validation',
          message: `Postal Code '*****' for Country 'US - [United States]' is invalid.`,
        },
      ]);
      cy.url().should('include', ROUTES.setupBranch.path);
    });

    it('should not be navigated to the Flows page if the branch creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.setupBranch.path);

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('Test Branch');
      selectOption(Module.branchSetup, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      cy.wait('@createBranchFailedRequest');

      cy.url().should('include', ROUTES.setupBranch.path);
    });

    it('should be navigated to the Flows page if the branch creation succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.setupBranch.path);
      verifyTextFields(Module.branchSetup, SubModule.branchDetails, {
        'form-header': 'Branch Details',
        'form-section-field-basicInfo': 'Basic Information',
        'form-section-field-address': 'Address Information',
      });

      interceptFetchBranchesRequest();

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.branchSetup, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.url().should('include', ROUTES.flows.path);
      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');
    });

    it('should display validation messages if the employee creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateProfileFailedRequest();
      cy.visit(ROUTES.employeeOnbarding.path);

      cy.wait('@fetchProfileFailedRequest');

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();

      clickActionButton(Module.employeeSetup, SubModule.employeeDetails);

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName-validation')
        .should('exist')
        .and('have.text', 'First Name is required');

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName-validation')
        .should('exist')
        .and('have.text', 'Last Name is required');
    });

    it('should display async validation messages if the employee creation failed with validation errors', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateProfileFailedWithErrorRequest();
      cy.visit(ROUTES.employeeOnbarding.path);

      cy.wait('@fetchProfileFailedRequest');

      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName').find('input').type('Joe');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName').find('input').type('Joe');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName').find('input').type('Joe Joe');

      clickActionButton(Module.employeeSetup, SubModule.employeeDetails);

      cy.wait('@createProfileFailedWithErrorRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to create an Employee');
      verifyFormValidationMessages(Module.employeeSetup, SubModule.employeeDetails, [
        {
          field: 'form-field-lastName-validation',
          message: `'First Name' and 'Last Name' cannot be the same.`,
        },
      ]);
      cy.url().should('include', ROUTES.setupEmployee.path);
    });

    it('should navigate to the Flows page at once if the branch creation succeeded and the employee had been created before', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchRequest();
      interceptFetchProfileRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.setupBranch.path);

      interceptFetchBranchesRequest();

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.branchSetup, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchProfileRequest');

      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('not.have.attr', 'disabled');
      cy.url().should('include', ROUTES.flows.path);
    });

    it('should not be able to navigate to the Company setup page from the Branch setup page by the browser back button if the Company has already been created', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.url().should('include', ROUTES.setupBranch.path);
      cy.go('back');

      cy.url().should('include', ROUTES.setupBranch.path);
    });

    it('should not be able to navigate to the Branch setup page from the Employee setup page by the browser back button if the Branch has already been created', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.employeeOnbarding.path);

      cy.url().should('include', ROUTES.setupEmployee.path);
      cy.go('back');

      cy.url().should('include', ROUTES.setupEmployee.path);
    });

    it('should be redirected to the Flows page if manually visiting a non-existing route from the Branch setup page', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.companyOnboarding.path);

      cy.url().should('include', ROUTES.setupBranch.path);
      cy.visit('/flows/onboarding/wrongUrl');

      cy.url().should('include', ROUTES.flows.path);
    });

    it('should be redirected to the Flows page if manually visiting a non-existing route from the Employee setup page', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.employeeOnbarding.path);

      cy.url().should('include', ROUTES.setupEmployee.path);
      cy.visit('/flows/onboarding/wrongUrl');

      cy.url().should('include', ROUTES.flows.path);
    });

    it('should display correct steps in the stepper when in different onboarding flows', () => {
      interceptFetchCompanyFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateCompanyRequest();
      interceptCreateBranchRequest();
      interceptCreateProfileRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Onboarding');
      cy.url().should('include', ROUTES.setupCompany.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 2);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Create Company');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Create Branch');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.companySetup, SubModule.companyDetails);
      interceptFetchCompanyRequest();
      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.setupBranch.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 2);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');
      cy.url().should('include', ROUTES.setupBranch.path);

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.branchSetup, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);
      interceptFetchBranchesRequest();
      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.url().should('include', ROUTES.flows.path);

      clickSubFlow('Employee Onboarding');
      cy.url().should('include', ROUTES.setupEmployee.path);

      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper', true).should('have.length', 1);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('not.exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('not.exist');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Create Employee');

      interceptFetchProfileRequest();
      clickActionButton(Module.employeeSetup, SubModule.employeeDetails);
      cy.wait('@createProfileRequest');
      cy.wait('@fetchProfileRequest');

      cy.url().should('include', ROUTES.flows.path);
    });

    it('should display correct steps in the stepper if the company has already been created', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Onboarding');

      cy.url().should('include', ROUTES.setupBranch.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 2);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');
    });
  });
});
