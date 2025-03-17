import { Module, SubModule } from '../../src/shared/models';
import {
  clickActionButton,
  clickField,
  fillBranchDetailsForm,
  getTestSelectorByModule,
  selectOption,
  verifyNotExist,
  verifyOptions,
  verifyBranchDetailsFormValidationMessages,
  verifyTextFields,
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
} from '../support/interceptors';

const setupRoutes = ['/setup/company', '/setup/branch', '/setup/employee'];

describe('Setup Flow Tests', () => {
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

      it('should navigate to company setup page and no other setup page if there is no company', () => {
        interceptFetchCompanyFailedRequest();

        cy.visit('/setup/company');
        cy.wait('@fetchCompanyFailedRequest');

        cy.url().should('include', '/setup/company');

        if (isAdminRole) {
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-general-validation-message').should('not.exist');
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-general-validation-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
          getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
        }

        cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');

        setupRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', '/setup/company');
        });
      });

      it('should navigate to branch setup page and no other setup page if company exists', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();

        cy.visit('/setup/branch');

        cy.url().should('include', '/setup/branch');

        if (isAdminRole) {
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-general-validation-message').should('not.exist');
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-action-button').should('have.attr', 'disabled');
          getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-general-validation-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
        }

        cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');

        setupRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', '/setup/branch');
        });
      });

      it('should navigate to employee setup page and no other setup page if company and branch exist', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();

        cy.visit('/setup/employee');
        cy.wait('@fetchCompanyRequest');
        cy.wait('@fetchBranchesRequest');
        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', '/setup/employee');
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').should('not.have.attr', 'disabled');
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-general-validation-message').should('not.exist');
        getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-action-button').should('contain.text', 'Finish');
        cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');

        setupRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', '/setup/employee');
        });
      });

      it('should not be able to navigate to the company page if employee creation failed', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        interceptCreateProfileFailedRequest();
        cy.visit('/setup');

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', '/setup/employee');

        clickActionButton(Module.employeeSetup, SubModule.employeeDetails);

        cy.wait('@createProfileFailedRequest');

        cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');
        cy.url().should('include', '/setup/employee');
      });

      it('should be able to navigate to the company page if employee creation succeeded', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        interceptCreateProfileRequest();
        cy.visit('/setup');

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', '/setup/employee');
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

        cy.get('[data-cy="menu-icon"]').should('not.have.attr', 'disabled');
        cy.url().should('include', '/manage/company');
      });

      it('should navigate to the company page if company, branch and employee data exist', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();

        cy.visit('/setup');
        cy.wait('@fetchCompanyRequest');
        cy.wait('@fetchBranchesRequest');
        cy.wait('@fetchProfileRequest');

        cy.get('[data-cy="menu-icon"]').should('not.have.attr', 'disabled');
        cy.url().should('include', '/manage/company');
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
      cy.visit('/setup');

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

    it('should not be able to navigate to branch setup step if company creation failed', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Test Company');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'UA');
      clickActionButton(Module.companySetup, SubModule.companyDetails);

      cy.wait('@createCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
    });

    it('should be able to navigate to branch setup step if company creation succeeded', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyRequest();
      interceptFetchBranchesFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', '/setup/company');
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-header').should('have.text', 'Company Details');
      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-section-field-basicInfo').should(
        'have.text',
        'Basic Information'
      );
      cy.get('[data-cy="company-logo"]').should('not.exist');
      cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');

      interceptFetchCompanyRequest();

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.companySetup, SubModule.companyDetails);

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
      cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');
      cy.get('[data-cy="company-logo"]').should('exist').and('have.text', 'Good Omens');
    });

    it('should display only available timezones for selected company country', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyRequest();

      cy.visit('/setup/company');

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('US Company');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.companySetup, SubModule.companyDetails);

      interceptFetchCompanyRequest();

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', '/setup/branch');
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
      interceptCreateBranchFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchBranchesFailedRequest');

      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      verifyBranchDetailsFormValidationMessages(Module.branchSetup, SubModule.branchDetails, [
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

      verifyBranchDetailsFormValidationMessages(Module.branchSetup, SubModule.branchDetails, [
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

    it('should not be able to navigate to employee setup step if branch creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', '/setup/branch');

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('Test Branch');
      selectOption(Module.branchSetup, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);

      cy.wait('@createBranchFailedRequest');

      cy.url().should('include', '/setup/branch');
    });

    it('should be able to navigate to employee setup step if branch creation succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchRequest();
      interceptFetchProfileFailedRequest();
      cy.visit('/setup');

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', '/setup/branch');
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

      cy.url().should('include', '/setup/employee');
      cy.get('[data-cy="menu-icon"]').should('have.attr', 'disabled');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-firstName')
        .find('input')
        .should('have.value', 'Admin');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-lastName')
        .find('input')
        .should('have.value', 'Mock');
      getTestSelectorByModule(Module.employeeSetup, SubModule.employeeDetails, 'form-field-fullName')
        .find('input')
        .should('have.value', 'Admin Oidc Mock');
    });

    it('should display validation messages if the employee creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateProfileFailedRequest();
      cy.visit('/setup');

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
  });
});
