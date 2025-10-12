import { COMPANY_SETTINGS_KEY, ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/types';
import {
  clickActionButton,
  getTestSelectorByModule,
  clickSubFlow,
  checkIsSubFlowDisabled,
  checkIsSubFlowHasDisabledAttribute,
  clickFlowsIcon,
  selectAction,
  verifyTextFields,
  verifyAppTheme,
} from 'support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchCompanyLicenseRequest,
  interceptDeleteProfileFailedRequest,
  interceptDeleteProfileRequest,
  interceptFetchProfileFailedRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchProfileRequest,
  interceptDeleteCompanySettingsFailedRequest,
  interceptDeleteCompanySettingsRequest,
  interceptFetchCompanySettingsFailedRequest,
  interceptDeleteBranchRequest,
  interceptFetchBranchesFailedRequest,
  interceptDeleteCompanyFailedRequest,
  interceptDeleteCompanyRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchEmployeesRequest,
  interceptFetchDepartmentsRequest,
  interceptFetchEmployeesByIdsRequest,
  interceptDeleteDepartmentRequest,
} from 'support/interceptors';

const companyOffboardingRoutes = [ROUTES.deleteCompanySettings.path, ROUTES.companyOffboardingInstructions.path, ROUTES.deleteCompany.path];

describe('Offboarding Flow Tests', () => {
  beforeEach(() => {
    cy.mockDarkTheme();
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

      it('should be redirected to the Delete Profile page', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanySettingsRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchProfileRequest();
        cy.visit(ROUTES.employeeOffboarding.path);

        cy.url().should('include', ROUTES.deleteEmployee.path);
        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-header').should('have.text', 'Delete Profile');
        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-submit-button')
          .should('exist')
          .and('have.text', 'Delete Profile');

        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-general-error-message').should('not.exist');
        getTestSelectorByModule(Module.deleteEmployee, SubModule.employeeDetails, 'form-submit-button').should('not.have.attr', 'disabled');
      });

      it('should be able to navigate to the Delete Profile page if the employee offboarding subflow is clicked', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanySettingsRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        checkIsSubFlowDisabled('Employee Offboarding', false);
        clickSubFlow('Employee Offboarding');

        cy.url().should('include', ROUTES.deleteEmployee.path);
      });

      it('should not be redirected to the Flows page if the profile deletion failed', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanySettingsRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
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
        interceptFetchCompanySettingsRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
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
        interceptFetchCompanySettingsRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
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

      it('should be redirected to the Company Offboarding Instructions page and no other offboarding page if at the first step', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanySettingsFailedRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchProfileRequest();
        cy.visit(ROUTES.offboarding.path);

        cy.url().should('include', ROUTES.companyOffboardingInstructions.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-general-error-message').should(
            'not.exist'
          );
          getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button').should(
            'not.have.attr',
            'disabled'
          );
        } else {
          getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-general-error-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
        }

        companyOffboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
        });
      });

      it('should be redirected to the Delete Company Settings page and no other offboarding page at the company settings step step', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanySettingsRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.offboarding.path);

        cy.url().should('include', ROUTES.deleteCompanySettings.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.deleteCompanySettings, SubModule.companySettingsDetails, 'form-general-error-message').should(
            'not.exist'
          );
          getTestSelectorByModule(Module.deleteCompanySettings, SubModule.companySettingsDetails, 'form-submit-button').should(
            'not.have.attr',
            'disabled'
          );
        } else {
          getTestSelectorByModule(Module.deleteCompanySettings, SubModule.companySettingsDetails, 'form-general-error-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
          getTestSelectorByModule(Module.deleteCompanySettings, SubModule.companySettingsDetails, 'form-submit-button').should(
            'have.attr',
            'disabled'
          );
        }

        companyOffboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.deleteCompanySettings.path);
        });
      });

      it('should be redirected to the Delete Company page and no other offboarding page if at the last step', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanySettingsFailedRequest();
        interceptFetchCompanyLicenseRequest();
        interceptFetchBranchesFailedRequest();
        interceptFetchProfileFailedRequest();
        cy.visit(ROUTES.offboarding.path);

        cy.url().should('include', ROUTES.deleteCompany.path);

        if (isAdminRole) {
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-general-error-message').should('not.exist');
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-submit-button').should('not.have.attr', 'disabled');
        } else {
          getTestSelectorByModule(Module.deleteCompany, SubModule.companyDetails, 'form-general-error-message')
            .should('exist')
            .and('contain.text', `You don't have the necessary permissions. Please reach out to your Company administrator for support.`);
        }

        companyOffboardingRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.deleteCompany.path);
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
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
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

    it('should be redirected to the Company Offboarding Instructions page if the company offboarding subflow is clicked', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchProfileRequest();
      cy.visit(ROUTES.flows.path);

      checkIsSubFlowHasDisabledAttribute('Company Offboarding', false);
      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-header': 'Delete Branches, Departments & Offboard Employees',
        'form-section-field-basicInfo':
          'Please ensure all branches and departments are deleted, and all employees are offboarded before proceeding to delete the company.',
        'form-field-value-branches': 'Remaining Branches: 1',
        'form-field-value-departments': 'Remaining Departments: 4',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Branch Catalog');
    });

    it('should not be redirected to the Delete Company Settings page if there are any branches', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchProfileRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-field-value-branches': 'Remaining Branches: 1',
        'form-field-value-departments': 'Remaining Departments: 4',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Branch Catalog')
        .click();

      cy.url().should('include', ROUTES.branches.path);

      clickFlowsIcon();

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', true);
    });

    it('should not be redirected to the Delete Company Settings page if there are any departments', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchProfileRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-field-value-branches': 'All branches have been removed!',
        'form-field-value-departments': 'Remaining Departments: 4',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Department Catalog')
        .click();

      cy.url().should('include', ROUTES.departments.path);

      clickFlowsIcon();

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', false);
    });

    it('should not be redirected to the Delete Company Settings page if there are any active employees', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsFailedRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchProfileRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-field-value-branches': 'All branches have been removed!',
        'form-field-value-departments': 'All departments have been removed!',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Employee Offboarding')
        .click();

      cy.url().should('include', ROUTES.deleteEmployee.path);

      clickFlowsIcon();

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', false);
    });

    it('should be redirected to the Delete Company Settings page if all branches and departments have been deleted and all employees have been offboarded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
      interceptFetchBranchesRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchDepartmentsTotalRequest', fixture: 'department/departments-single' }
      );
      interceptFetchEmployeesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchEmployeesByIdsRequest();
      interceptDeleteDepartmentRequest('444444444444');
      interceptFetchProfileRequest();
      interceptDeleteBranchRequest('222222222222');
      interceptDeleteProfileRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);

      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-field-value-branches': 'Remaining Branches: 1',
        'form-field-value-departments': 'Remaining Departments: 1',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Branch Catalog')
        .click();

      cy.url().should('include', ROUTES.branches.path);
      clickFlowsIcon();

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
      clickActionButton(Module.companyOffboardingInstructions, SubModule.offboardingDetails);
      cy.wait(['@fetchBranchesRequest']);

      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetchNoBranchesRequest', fixture: 'branch/branches-empty' });
      selectAction(Module.branchManagement, SubModule.branchCatalog, 'delete', '222222222222');
      cy.wait(['@deleteBranchRequest', '@fetchNoBranchesRequest']);

      getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-row', true).should('have.length', 0);

      clickFlowsIcon();

      clickSubFlow('Company Offboarding');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingBranchesRequest', fixture: 'branch/branches-empty' }
      );
      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);
      cy.wait('@fetchEmptyOnboardingBranchesRequest');

      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-field-value-branches': 'All branches have been removed!',
        'form-field-value-departments': 'Remaining Departments: 1',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Department Catalog')
        .click();

      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchDepartmentsRequest', fixture: 'department/departments-single' }
      );

      cy.url().should('include', ROUTES.departments.path);

      selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'delete', '444444444444');
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchNoDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      cy.wait(['@deleteDepartmentRequest', '@fetchNoDepartmentsRequest']);

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 0);

      clickFlowsIcon();
      clickSubFlow('Company Offboarding');
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );

      verifyTextFields(Module.companyOffboardingInstructions, SubModule.offboardingDetails, {
        'form-field-value-branches': 'All branches have been removed!',
        'form-field-value-departments': 'All departments have been removed!',
        'form-field-value-employees': 'Active Employees: 1',
      });
      getTestSelectorByModule(Module.companyOffboardingInstructions, SubModule.offboardingDetails, 'form-submit-button')
        .should('exist')
        .and('have.text', 'Go to Employee Offboarding')
        .click();

      cy.url().should('include', ROUTES.deleteEmployee.path);
      clickActionButton(Module.deleteEmployee, SubModule.employeeDetails);
      cy.wait('@deleteProfileRequest');

      clickFlowsIcon();
      clickSubFlow('Company Offboarding');
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      cy.url().should('include', ROUTES.deleteCompanySettings.path);
    });

    it('should not be redirected to the Delete Company page if the company settings deletion failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchProfileFailedRequest();
      interceptDeleteCompanySettingsFailedRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');
      clickActionButton(Module.deleteCompanySettings, SubModule.companySettingsDetails);
      cy.wait('@deleteCompanySettingsFailedRequest');

      cy.url().should('include', ROUTES.deleteCompanySettings.path);
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to delete the Company Settings');

      clickFlowsIcon();

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', false);
    });

    it('should be redirected to the Delete Company page if the company settings deletion succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest('fetchCompanySettingsUpdatedRequest', 'company/company-settings-updated');
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchProfileFailedRequest();
      interceptDeleteCompanySettingsRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');
      cy.wait('@fetchCompanySettingsUpdatedRequest');

      verifyAppTheme('dark', 'ocean');
      interceptFetchCompanySettingsFailedRequest();
      clickActionButton(Module.deleteCompanySettings, SubModule.companySettingsDetails);
      cy.wait(['@deleteCompanySettingsRequest', '@fetchCompanySettingsFailedRequest']);

      cy.url().should('include', ROUTES.deleteCompany.path);
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company Settings has been successfully deleted');
      verifyAppTheme('dark', 'midnight');
      cy.window().then((win) => {
        const stored = win.localStorage.getItem(COMPANY_SETTINGS_KEY);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(stored).to.be.null;
      });
    });

    it('should not be redirected to the Flows page if the company deletion failed', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsFailedRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchProfileFailedRequest();
      interceptDeleteCompanyFailedRequest();
      cy.visit(ROUTES.flows.path);

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', false);

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.deleteCompany.path);

      clickActionButton(Module.deleteCompany, SubModule.companyDetails);
      cy.wait('@deleteCompanyFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Unable to delete the Company. It has dependent entities');
    });

    it('should be redirected to the Flows page if the company deletion succeeded', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsFailedRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchProfileFailedRequest();
      interceptDeleteCompanyRequest();
      cy.visit(ROUTES.flows.path);

      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Company Onboarding', false);

      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.deleteCompany.path);

      interceptFetchCompanyFailedRequest();
      clickActionButton(Module.deleteCompany, SubModule.companyDetails);
      cy.wait(['@deleteCompanyRequest', '@fetchCompanyFailedRequest']);

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
      interceptFetchCompanySettingsFailedRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchProfileFailedRequest();
      interceptDeleteCompanyRequest();
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');
      interceptFetchCompanyFailedRequest();
      clickActionButton(Module.deleteCompany, SubModule.companyDetails);
      cy.wait(['@deleteCompanyRequest', '@fetchCompanyFailedRequest']);

      cy.location('pathname').should('eq', ROUTES.flows.path);

      [ROUTES.viewCompany.path, ROUTES.editCompany.path].forEach((route) => {
        cy.visit(route);
        cy.wait('@fetchCompanyFailedRequest');
        cy.location('pathname').should('eq', ROUTES.flows.path);
      });
    });

    it('should display correct steps in the stepper when in different offboarding steps', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanySettingsRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
      interceptFetchDepartmentsRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingDepartmentsRequest', fixture: 'department/departments-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 1 },
        { alias: 'fetchEmptyOnboardingEmployeesRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptDeleteBranchRequest('222222222222');
      cy.visit(ROUTES.flows.path);

      clickSubFlow('Company Offboarding');
      cy.url().should('include', ROUTES.companyOffboardingInstructions.path);

      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-instructions')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-instructions')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Delete Branches, Departments & Offboard Employees');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-companySettings')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-companySettings')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Delete Company Settings');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-company')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-company')
        .find('.MuiStepLabel-label')
        .should('have.text', 'Delete Company');

      clickActionButton(Module.companyOffboardingInstructions, SubModule.offboardingDetails);
      cy.url().should('include', ROUTES.branches.path);
      cy.wait(['@fetchBranchesRequest']);

      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetchNoBranchesRequest', fixture: 'branch/branches-empty' });
      selectAction(Module.branchManagement, SubModule.branchCatalog, 'delete', '222222222222');
      cy.wait(['@deleteBranchRequest', '@fetchNoBranchesRequest']);

      clickFlowsIcon();
      interceptFetchBranchesFailedRequest();
      clickSubFlow('Company Offboarding');

      cy.url().should('include', ROUTES.deleteCompanySettings.path);
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-instructions')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-companySettings')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-company')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('have.class', 'Mui-disabled');

      interceptDeleteCompanySettingsRequest();
      interceptFetchCompanySettingsFailedRequest();
      clickActionButton(Module.deleteCompanySettings, SubModule.companySettingsDetails);
      cy.wait(['@deleteCompanySettingsRequest', '@fetchCompanySettingsFailedRequest']);

      cy.url().should('include', ROUTES.deleteCompany.path);
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper', true).should('have.length', 3);
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-instructions')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-companySettings')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
      getTestSelectorByModule(Module.offboarding, SubModule.companyOffboarding, 'stepper-company')
        .should('exist')
        .find('.MuiStepLabel-root')
        .should('not.have.class', 'Mui-disabled');
    });
  });
});
