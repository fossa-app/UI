import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  clickField,
  fillBranchDetailsForm,
  getTestSelectorByModule,
  selectOption,
  verifyNotExist,
  verifyFormValidationMessages,
  verifyTextFields,
  clickSubFlow,
  uploadTestFile,
  verifyOptions,
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
  interceptFetchCompanyLicenseRequest,
  interceptUploadCompanyLicenseFailedRequest,
  interceptUploadCompanyLicenseRequest,
} from '../support/interceptors';

const companyOnboardingRoutes = [ROUTES.createCompany.path, ROUTES.uploadCompanyLicense.path, ROUTES.createBranch.path];
const employeeOnboardingRoutes = [ROUTES.createEmployee.path];

describe('Onboarding Flow Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
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

      it('should navigate to the Company creation page and no other onboarding page if there is no company', () => {
        interceptFetchCompanyFailedRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.wait('@fetchCompanyFailedRequest');

        cy.url().should('include', ROUTES.createCompany.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-general-error-message').should('not.exist');
          getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-general-error-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
          getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
        }

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.createCompany.path);
        });
        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.location('pathname').should('eq', ROUTES.flows.path);
        });
      });

      it('should navigate to the Company License upload page and no other onboarding page if there is no company license', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseFailedRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.wait('@fetchCompanyLicenseFailedRequest');

        cy.url().should('include', ROUTES.uploadCompanyLicense.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-general-error-message').should(
            'not.exist'
          );
          getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-action-button').should(
            'not.have.attr',
            'disabled'
          );
        } else {
          getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-general-error-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
          getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-action-button').should(
            'have.attr',
            'disabled'
          );
        }

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.uploadCompanyLicense.path);
        });
        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.location('pathname').should('eq', ROUTES.createEmployee.path);
        });
      });

      it('should navigate to the Branch creation page and no other onboarding page if company has been created and the company license has been uploaded', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.url().should('include', ROUTES.createBranch.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-general-error-message').should('not.exist');
          getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-action-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-action-button').should('have.attr', 'disabled');
          getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-general-error-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
        }

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.createBranch.path);
        });
        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.location('pathname').should('eq', ROUTES.createEmployee.path);
        });
      });

      it('should navigate to the Employee creation page and no other onboarding page if navigating to Employee onboarding flow', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.employeeOnboarding.path);

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', ROUTES.createEmployee.path);
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-action-button').should('not.have.attr', 'disabled');
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-general-error-message').should('not.exist');
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-action-button').should('contain.text', 'Finish');
        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

        employeeOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.createEmployee.path);
        });
        companyOnboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.location('pathname').should('eq', ROUTES.createBranch.path);
        });
      });

      it('should not be able to navigate to the Profile page if employee creation failed', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        interceptCreateProfileFailedRequest();
        cy.visit(ROUTES.employeeOnboarding.path);

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', ROUTES.createEmployee.path);

        clickActionButton(Module.createEmployee, SubModule.employeeDetails);

        cy.wait('@createProfileFailedRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');
        cy.url().should('include', ROUTES.createEmployee.path);
      });

      it('should be able to navigate to the Flows page if the employee creation succeeded', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        interceptCreateProfileRequest();
        cy.visit(ROUTES.employeeOnboarding.path);

        cy.wait('@fetchProfileFailedRequest');

        cy.url().should('include', ROUTES.createEmployee.path);
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-header').should('have.text', 'Employee Details');
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-section-field-basicInfo').should(
          'have.text',
          'Basic Information'
        );

        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-firstName').find('input').type(firstName);
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-lastName').find('input').type(lastName);
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();
        getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-fullName').find('input').type(fullName);

        interceptFetchProfileRequest();
        clickActionButton(Module.createEmployee, SubModule.employeeDetails);

        cy.wait('@createProfileRequest');
        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('not.have.attr', 'disabled');
        cy.location('pathname').should('eq', ROUTES.flows.path);
      });

      it('should be able to navigate to the Company page by clicking the company logo if the company has been created', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.createEmployee.path);

        cy.wait('@fetchProfileFailedRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo').should('exist').click();

        cy.url().should('include', ROUTES.viewCompany.path);
      });

      it('should navigate to the Flows page if company, company license, branch and employee data exist', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.onboarding.path);

        cy.wait('@fetchCompanyRequest');
        cy.wait('@fetchCompanyLicenseRequest');
        cy.wait('@fetchBranchesRequest');
        cy.wait('@fetchProfileRequest');

        getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('not.have.attr', 'disabled');
        cy.location('pathname').should('eq', ROUTES.flows.path);
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

      clickActionButton(Module.createCompany, SubModule.companyDetails);

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'Company Name is required');

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-countryCode-validation')
        .should('exist')
        .and('have.text', 'Country is required');

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').type(
        'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long company name'
      );

      clickActionButton(Module.createCompany, SubModule.companyDetails);

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'The Company Name must not exceed 50 characters.');
    });

    it('should not be able to navigate to the Company License upload step if the company creation failed', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', ROUTES.createCompany.path);

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').type('Test Company');
      selectOption(Module.createCompany, SubModule.companyDetails, 'countryCode', 'UA');
      clickActionButton(Module.createCompany, SubModule.companyDetails);

      cy.wait('@createCompanyFailedRequest');

      cy.url().should('include', ROUTES.createCompany.path);
    });

    it('should display async validation messages if the company creation failed with validation errors', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyFailedWithErrorRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').find('input').type('Good Omens Updated');
      selectOption(Module.createCompany, SubModule.companyDetails, 'countryCode', 'DE');

      clickActionButton(Module.createCompany, SubModule.companyDetails);

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to create a Company');
      verifyFormValidationMessages(Module.createCompany, SubModule.companyDetails, [
        {
          field: 'form-field-name-validation',
          message: `Company 'Good Omens Updated' already exists in the system.`,
        },
      ]);
      cy.url().should('include', ROUTES.createCompany.path);
    });

    it('should be able to navigate to the Company License upload step if the company creation succeeded', () => {
      interceptFetchCompanyFailedRequest();
      interceptCreateCompanyRequest();
      interceptFetchCompanyLicenseFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyFailedRequest');

      cy.url().should('include', ROUTES.createCompany.path);
      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-header').should('have.text', 'Company Details');
      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-section-field-basicInfo').should(
        'have.text',
        'Basic Information'
      );
      getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo').should('not.exist');
      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');

      interceptFetchCompanyRequest();

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.createCompany, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.createCompany, SubModule.companyDetails);

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');
      getTestSelectorByModule(Module.shared, SubModule.header, 'company-logo').should('exist').and('have.text', 'Good Omens');
      getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');
    });

    it('should display validation messages if the company license upload form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyLicenseFailedRequest');

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-value-companyId')
        .should('exist')
        .find('div p')
        .and('have.text', '111111111111');

      clickActionButton(Module.uploadCompanyLicense, SubModule.companyLicenseDetails);

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-licenseFile-file-upload-validation')
        .should('exist')
        .and('have.text', 'Company License is required');

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-licenseFile-file-upload').click();
      uploadTestFile('input#file-upload-input', 'company/invalid-company-license.lic');
      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'file-upload-selected-file-name').should(
        'have.text',
        'company/invalid-company-license.lic'
      );
      getTestSelectorByModule(
        Module.uploadCompanyLicense,
        SubModule.companyLicenseDetails,
        'form-field-licenseFile-file-upload-validation'
      ).should('not.exist');
    });

    it('should not be able to navigate to the Branch creation step if the company license upload failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptUploadCompanyLicenseFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyLicenseFailedRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-licenseFile-file-upload').click();
      uploadTestFile('input#file-upload-input', 'company/invalid-company-license.lic');
      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'file-upload-selected-file-name').should(
        'have.text',
        'company/invalid-company-license.lic'
      );
      clickActionButton(Module.uploadCompanyLicense, SubModule.companyLicenseDetails);

      cy.wait('@uploadCompanyLicenseFailedRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to upload Company license');
      getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');
    });

    it('should be able to navigate to the Branch creation step if the company license upload succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptUploadCompanyLicenseRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyLicenseFailedRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-licenseFile-file-upload').click();
      uploadTestFile('input#file-upload-input', 'company/valid-company-license.lic');
      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'file-upload-selected-file-name').should(
        'have.text',
        'company/valid-company-license.lic'
      );
      interceptFetchCompanyLicenseRequest();
      clickActionButton(Module.uploadCompanyLicense, SubModule.companyLicenseDetails);

      cy.wait('@uploadCompanyLicenseRequest');
      cy.wait('@fetchCompanyLicenseRequest');

      cy.url().should('include', ROUTES.createBranch.path);
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company License has been successfully uploaded');
      getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('exist').and('have.text', 'TCL');
    });

    it('should display only available timezones for selected company country', () => {
      interceptFetchCompanyFailedRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptCreateCompanyRequest();
      interceptUploadCompanyLicenseRequest();
      cy.visit(ROUTES.onboarding.path);

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').type('US Company');
      selectOption(Module.createCompany, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.createCompany, SubModule.companyDetails);

      interceptFetchCompanyRequest();

      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-licenseFile-file-upload').click();
      uploadTestFile('input#file-upload-input', 'company/valid-company-license.lic');
      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'file-upload-selected-file-name').should(
        'have.text',
        'company/valid-company-license.lic'
      );
      interceptFetchCompanyLicenseRequest();
      clickActionButton(Module.uploadCompanyLicense, SubModule.companyLicenseDetails);

      cy.wait('@uploadCompanyLicenseRequest');
      cy.wait('@fetchCompanyLicenseRequest');

      cy.url().should('include', ROUTES.createBranch.path);
      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-timeZoneId').click();

      verifyOptions(Module.createBranch, SubModule.branchDetails, 'form-field-timeZoneId-option', [
        'Pacific/Honolulu',
        'America/Anchorage',
        'America/New_York',
        'America/Chicago',
      ]);
    });

    it('should display validation messages if the branch creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit(ROUTES.companyOnboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      clickActionButton(Module.createBranch, SubModule.branchDetails);

      verifyFormValidationMessages(Module.createBranch, SubModule.branchDetails, [
        { field: 'form-field-name-validation', message: 'Branch Name is required' },
        { field: 'form-field-timeZoneId-validation', message: 'TimeZone is required' },
        { field: 'form-field-address.line1-validation', message: 'Address Line 1 is required' },
        { field: 'form-field-address.city-validation', message: 'City is required' },
        { field: 'form-field-address.countryCode-validation', message: 'Country is required' },
        { field: 'form-field-address.subdivision-validation', message: 'State is required' },
        { field: 'form-field-address.postalCode-validation', message: 'Postal Code is required' },
      ]);

      fillBranchDetailsForm(Module.createBranch, SubModule.branchDetails, {
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

      clickActionButton(Module.createBranch, SubModule.branchDetails);

      verifyFormValidationMessages(Module.createBranch, SubModule.branchDetails, [
        { field: 'form-field-name-validation', message: 'The Branch Name must not exceed 50 characters.' },
        { field: 'form-field-address.line1-validation', message: 'Address Line 1 must not exceed 50 characters.' },
        { field: 'form-field-address.line2-validation', message: 'Address Line 2 must not exceed 50 characters.' },
        { field: 'form-field-address.city-validation', message: 'City must not exceed 50 characters.' },
        { field: 'form-field-address.subdivision-validation', message: 'State must not exceed 50 characters.' },
      ]);

      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-address.postalCode').find('input').clear();
      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-address.postalCode').find('input').type('12');

      clickActionButton(Module.createBranch, SubModule.branchDetails);

      clickField(Module.createBranch, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.createBranch, SubModule.branchDetails);

      verifyNotExist(Module.createBranch, SubModule.branchDetails, [
        'form-field-address.line1-validation',
        'form-field-address.line2-validation',
        'form-field-address.city-validation',
        'form-field-address.subdivision-validation',
        'form-field-address.postalCode-validation',
      ]);
    });

    it('should display async validation messages if the branch creation failed with validation errors', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateBranchFailedWithErrorRequest();
      cy.visit(ROUTES.companyOnboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      fillBranchDetailsForm(Module.createBranch, SubModule.branchDetails, {
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

      clickActionButton(Module.createBranch, SubModule.branchDetails);

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to create a Branch');
      verifyFormValidationMessages(Module.createBranch, SubModule.branchDetails, [
        {
          field: 'form-field-address.postalCode-validation',
          message: `Postal Code '*****' for Country 'US - [United States]' is invalid.`,
        },
      ]);
      cy.url().should('include', ROUTES.createBranch.path);
    });

    it('should not be navigated to the Flows page if the branch creation failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateBranchFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.createBranch.path);

      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-name').type('Test Branch');
      selectOption(Module.createBranch, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.createBranch, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.createBranch, SubModule.branchDetails);

      cy.wait('@createBranchFailedRequest');

      cy.url().should('include', ROUTES.createBranch.path);
    });

    it('should be navigated to the Flows page if the branch creation succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.createBranch.path);
      verifyTextFields(Module.createBranch, SubModule.branchDetails, {
        'form-header': 'Branch Details',
        'form-section-field-basicInfo': 'Basic Information',
        'form-section-field-address': 'Address Information',
      });

      interceptFetchBranchesRequest();

      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.createBranch, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.createBranch, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.createBranch, SubModule.branchDetails);

      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);
      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('have.attr', 'disabled');
    });

    it('should display validation messages if the employee creation form is invalid', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateProfileFailedRequest();
      cy.visit(ROUTES.employeeOnboarding.path);

      cy.wait('@fetchProfileFailedRequest');

      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();

      clickActionButton(Module.createEmployee, SubModule.employeeDetails);

      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-firstName-validation')
        .should('exist')
        .and('have.text', 'First Name is required');

      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-lastName-validation')
        .should('exist')
        .and('have.text', 'Last Name is required');
    });

    it('should display async validation messages if the employee creation failed with validation errors', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptCreateProfileFailedWithErrorRequest();
      cy.visit(ROUTES.employeeOnboarding.path);

      cy.wait('@fetchProfileFailedRequest');

      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-firstName').find('input').clear();
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-firstName').find('input').type('Joe');
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-lastName').find('input').clear();
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-lastName').find('input').type('Joe');
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-fullName').find('input').clear();
      getTestSelectorByModule(Module.createEmployee, SubModule.employeeDetails, 'form-field-fullName').find('input').type('Joe Joe');

      clickActionButton(Module.createEmployee, SubModule.employeeDetails);

      cy.wait('@createProfileFailedWithErrorRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to create an Employee');
      verifyFormValidationMessages(Module.createEmployee, SubModule.employeeDetails, [
        {
          field: 'form-field-lastName-validation',
          message: `'First Name' and 'Last Name' cannot be the same.`,
        },
      ]);
      cy.url().should('include', ROUTES.createEmployee.path);
    });

    it('should navigate to the Flows page at once if the branch creation succeeded and the employee had been created before', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateBranchRequest();
      interceptFetchProfileRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.createBranch.path);

      interceptFetchBranchesRequest();

      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.createBranch, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.createBranch, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.createBranch, SubModule.branchDetails);

      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchProfileRequest');

      getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').should('not.have.attr', 'disabled');
      cy.location('pathname').should('eq', ROUTES.flows.path);
    });

    it('should not be able to navigate to the Company creation page from the Company License upload page if the Company has already been created', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchCompanyLicenseFailedRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      cy.visit(ROUTES.createCompany.path);

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
    });

    it('should not be able to navigate to the Company License upload page from the Branch creation page if the Company license has already been uploaded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.onboarding.path);

      cy.wait('@fetchBranchesFailedRequest');

      cy.url().should('include', ROUTES.createBranch.path);
      cy.visit(ROUTES.uploadCompanyLicense.path);

      cy.url().should('include', ROUTES.createBranch.path);
    });

    it('should be redirected to the Flows page if manually visiting a non-existing route from the Branch creation page', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.companyOnboarding.path);

      cy.url().should('include', ROUTES.createBranch.path);
      cy.visit('/flows/onboarding/wrongUrl');

      cy.location('pathname').should('eq', ROUTES.flows.path);
    });

    it('should be redirected to the Flows page if manually visiting a non-existing route from the Employee creation page', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.employeeOnboarding.path);

      cy.url().should('include', ROUTES.createEmployee.path);
      cy.visit('/flows/onboarding/wrongUrl');

      cy.location('pathname').should('eq', ROUTES.flows.path);
    });

    it('should display correct steps in the stepper when in different onboarding flows', () => {
      interceptFetchCompanyFailedRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateCompanyRequest();
      interceptUploadCompanyLicenseRequest();
      interceptCreateBranchRequest();
      interceptCreateProfileRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Onboarding');
      cy.url().should('include', ROUTES.createCompany.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Create Company');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Upload Company License');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Create Branch');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.createCompany, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.createCompany, SubModule.companyDetails);
      interceptFetchCompanyRequest();
      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');

      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'form-field-licenseFile-file-upload').click();
      uploadTestFile('input#file-upload-input', 'company/valid-company-license.lic');
      getTestSelectorByModule(Module.uploadCompanyLicense, SubModule.companyLicenseDetails, 'file-upload-selected-file-name').should(
        'have.text',
        'company/valid-company-license.lic'
      );
      interceptFetchCompanyLicenseRequest();
      clickActionButton(Module.uploadCompanyLicense, SubModule.companyLicenseDetails);
      cy.wait('@uploadCompanyLicenseRequest');
      cy.wait('@fetchCompanyLicenseRequest');

      cy.url().should('include', ROUTES.createBranch.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');

      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.createBranch, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.createBranch, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.createBranch, SubModule.branchDetails);
      interceptFetchBranchesRequest();
      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);

      clickSubFlow('Employee Onboarding');
      cy.url().should('include', ROUTES.createEmployee.path);

      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper', true).should('have.length', 1);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('not.exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense').should('not.exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('not.exist');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Create Employee');

      interceptFetchProfileRequest();
      clickActionButton(Module.createEmployee, SubModule.employeeDetails);
      cy.wait('@createProfileRequest');
      cy.wait('@fetchProfileRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);
    });

    it('should display correct steps in the stepper if the company has already been created', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchProfileFailedRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Onboarding');

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-company')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-companyLicense')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch').should('exist');
      getTestSelectorByModule(Module.onboarding, SubModule.companyOnboarding, 'stepper-branch')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.onboarding, SubModule.employeeOnboarding, 'stepper-employee').should('not.exist');
    });
  });
});
