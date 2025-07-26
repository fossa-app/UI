import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  checkIsSubFlowDisabled,
  checkIsSubFlowHasDisabledAttribute,
  clickActionButton,
  clickField,
  clickFlow,
  clickFlowsIcon,
  clickSubFlow,
  getTestSelectorByModule,
  selectAction,
  selectColorScheme,
  selectOption,
  uploadTestFile,
} from 'support/helpers';
import {
  interceptCreateBranchRequest,
  interceptCreateCompanyRequest,
  interceptCreateCompanySettingsRequest,
  interceptCreateProfileRequest,
  interceptDeleteBranchRequest,
  interceptFetchBranchesFailedRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsFailedRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchProfileFailedRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptLogoutRequest,
  interceptOpenidConfigurationRequest,
  interceptUploadCompanyLicenseRequest,
} from 'support/interceptors';

describe('Flows Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchCompanySettingsRequest();
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
    const isAdminRole = role === 'Admin';

    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
        cy.visit(ROUTES.flows.path);
      });

      describe('Onboarding Not Completed Tests', () => {
        it(`should ${isAdminRole ? 'enable' : 'disable'} the Company Onboarding flow for ${role}`, () => {
          interceptFetchCompanyFailedRequest();

          // TODO: MUI element does not set disabled attribute for this specific use case, check the isSubFlowDisabled method in FlowGroup component
          checkIsSubFlowHasDisabledAttribute('Company Onboarding', !isAdminRole);
        });

        it('should display correct enabled and disabled subFlows if the Company has been created', () => {
          interceptFetchCompanyRequest();
          interceptFetchBranchesFailedRequest();
          interceptFetchProfileFailedRequest();

          checkIsSubFlowHasDisabledAttribute('Company Onboarding', !isAdminRole);
          checkIsSubFlowDisabled('View Company', false);
          checkIsSubFlowDisabled('Company Settings', false);
          checkIsSubFlowDisabled('Company Offboarding', false);
          checkIsSubFlowDisabled('Branches', true);
          checkIsSubFlowDisabled('Departments', true);
          checkIsSubFlowDisabled('Employees', true);
          checkIsSubFlowDisabled('Employee Onboarding', false);
          checkIsSubFlowDisabled('View Profile', true);
          checkIsSubFlowDisabled('Employee Offboarding', true);
        });

        it('should display correct enabled and disabled subFlows if the Company Onboarding has been completed', () => {
          interceptFetchCompanyRequest();
          interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
          interceptFetchProfileFailedRequest();

          checkIsSubFlowDisabled('Company Onboarding', true);
          checkIsSubFlowDisabled('View Company', false);
          checkIsSubFlowDisabled('Company Settings', false);
          checkIsSubFlowDisabled('Company Offboarding', false);
          checkIsSubFlowDisabled('Branches', true);
          checkIsSubFlowDisabled('Departments', true);
          checkIsSubFlowDisabled('Employees', true);
          checkIsSubFlowDisabled('Employee Onboarding', false);
          checkIsSubFlowDisabled('View Profile', true);
          checkIsSubFlowDisabled('Employee Offboarding', true);
        });
      });

      describe('Onboarding Completed Tests', () => {
        beforeEach(() => {
          interceptFetchCompanyRequest();
          interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
          interceptFetchProfileRequest();
        });

        it('should render the Flows page', () => {
          getTestSelectorByModule(Module.manage, SubModule.flows, 'page-title').should('have.text', 'Flows');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'page-subtitle').should('have.text', 'Manage Flows');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group', true).should('have.length', 5);
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Company').should('exist').and('have.text', 'Company');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Branches').should('exist').and('have.text', 'Branches');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Departments').should('exist').and('have.text', 'Departments');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Employees').should('exist').and('have.text', 'Employees');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Profile').should('exist').and('have.text', 'Profile');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Company Onboarding')
            .should('exist')
            .and('have.text', 'Company Onboarding');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-View Company')
            .should('exist')
            .and('have.text', 'View Company');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Company Settings')
            .should('exist')
            .and('have.text', 'Company Settings');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Company Offboarding')
            .should('exist')
            .and('have.text', 'Company Offboarding');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Branches').should('exist').and('have.text', 'Branches');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Departments').should('exist').and('have.text', 'Departments');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Employees').should('exist').and('have.text', 'Employees');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Employee Onboarding')
            .should('exist')
            .and('have.text', 'Employee Onboarding');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-View Profile')
            .should('exist')
            .and('have.text', 'View Profile');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Employee Offboarding')
            .should('exist')
            .and('have.text', 'Employee Offboarding');
        });

        it('should hide the flows icon if not authenticated', () => {
          interceptOpenidConfigurationRequest();
          interceptLogoutRequest();

          getTestSelectorByModule(Module.shared, SubModule.header, 'flows-icon').should('exist');

          getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();
          getTestSelectorByModule(Module.shared, SubModule.header, 'logout-button').click();

          cy.logoutMock();
          cy.wait('@openidConfigurationRequest');
          cy.wait('@logoutRequest');

          getTestSelectorByModule(Module.shared, SubModule.header, 'flows-icon').should('not.exist');
        });

        it('should navigate correctly by urls from the Flows page', () => {
          [ROUTES.viewCompany.path, ROUTES.branches.path, ROUTES.employees.path, ROUTES.viewProfile.path].forEach((route) => {
            cy.visit(route);
            cy.url().should('include', route);
          });
        });

        it('should not be able to navigate by urls from the Flows page if the subflow is disabled', () => {
          [ROUTES.createCompany.path, ROUTES.createBranch.path, ROUTES.createEmployee.path].forEach((route) => {
            cy.visit(route);
            cy.location('pathname').should('eq', ROUTES.flows.path);
          });
        });

        it('should toggle the subFlows when toggling the flow or the icon', () => {
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Company').should('exist');
          clickFlow('Company');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Company').should('not.exist');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-toggle-icon-Company').click();
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Company').should('exist');

          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Branches').should('exist');
          clickFlow('Branches');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Branches').should('not.exist');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-toggle-icon-Branches').click();
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Branches').should('exist');

          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Departments').should('exist');
          clickFlow('Departments');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Departments').should('not.exist');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-toggle-icon-Departments').click();
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Departments').should('exist');

          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Employees').should('exist');
          clickFlow('Employees');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Employees').should('not.exist');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-toggle-icon-Employees').click();
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Employees').should('exist');

          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Profile').should('exist');
          clickFlow('Profile');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Profile').should('not.exist');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-toggle-icon-Profile').click();
          getTestSelectorByModule(Module.manage, SubModule.flows, 'subFlows-container-Profile').should('exist');
        });

        it('should correctly navigate manually from the Flows page', () => {
          clickSubFlow('View Company');
          cy.url().should('include', ROUTES.viewCompany.path);

          cy.visit(ROUTES.flows.path);
          clickSubFlow('Branches');
          cy.url().should('include', ROUTES.branches.path);

          cy.visit(ROUTES.flows.path);
          clickSubFlow('Departments');
          cy.url().should('include', ROUTES.departments.path);

          cy.visit(ROUTES.flows.path);
          clickSubFlow('Employees');
          cy.url().should('include', ROUTES.employees.path);

          cy.visit(ROUTES.flows.path);
          clickSubFlow('View Profile');
          cy.url().should('include', ROUTES.viewProfile.path);
        });

        it('should display correct enabled and disabled subFlows', () => {
          checkIsSubFlowDisabled('Company Onboarding', true);
          checkIsSubFlowDisabled('View Company', false);
          checkIsSubFlowDisabled('Company Settings', false);
          checkIsSubFlowDisabled('Company Offboarding', false);
          checkIsSubFlowDisabled('Branches', false);
          checkIsSubFlowDisabled('Departments', false);
          checkIsSubFlowDisabled('Employees', false);
          checkIsSubFlowDisabled('Employee Onboarding', true);
          checkIsSubFlowDisabled('View Profile', false);
          checkIsSubFlowDisabled('Employee Offboarding', false);
        });

        it('should navigate to the Flows page if the flows navigation icon is clicked', () => {
          cy.visit(ROUTES.viewCompany.path);
          clickFlowsIcon();

          cy.location('pathname').should('eq', ROUTES.flows.path);
        });

        it(`${isAdminRole ? 'should' : 'should not'} be able to navigate manually from the Flows page`, () => {
          if (isAdminRole) {
            checkIsSubFlowDisabled('Company Settings', false);
          } else {
            checkIsSubFlowHasDisabledAttribute('Company Settings', true);
          }

          cy.visit(ROUTES.companySettings.path);

          cy.url().should('include', isAdminRole ? ROUTES.companySettings.path : ROUTES.viewCompany.path);
        });
      });
    });
  });

  describe('Onboarding Not Completed Tests Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
      cy.visit(ROUTES.flows.path);
    });

    it('should display correct enabled and disabled subFlows if the last branch has been deleted', () => {
      interceptFetchCompanyRequest();
      interceptFetchCompanyLicenseRequest();
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
      interceptFetchBranchesRequest();
      interceptFetchProfileRequest();
      interceptDeleteBranchRequest('222222222222');

      clickSubFlow('Branches');
      cy.url().should('include', ROUTES.branches.path);

      selectAction(Module.branchManagement, SubModule.branchCatalog, 'delete', '222222222222');
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetchNoBranchesRequest', fixture: 'branch/branches-empty' });
      cy.wait('@deleteBranchRequest');
      cy.wait('@fetchNoBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-row', true).should('have.length', 0);
      clickFlowsIcon();

      cy.location('pathname').should('eq', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', true);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Settings', false);
      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Branches', false);
      checkIsSubFlowDisabled('Departments', false);
      checkIsSubFlowDisabled('Employees', false);
      checkIsSubFlowDisabled('Employee Onboarding', true);
      checkIsSubFlowDisabled('View Profile', false);
      checkIsSubFlowDisabled('Employee Offboarding', false);

      clickSubFlow('Company Onboarding');

      cy.location('pathname').should('eq', ROUTES.flows.path);
    });

    it('should display correct enabled and disabled subFlows when in different onboarding flows', () => {
      interceptFetchCompanyFailedRequest();
      interceptFetchCompanySettingsFailedRequest();
      interceptFetchCompanyLicenseFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateCompanyRequest();
      interceptCreateCompanySettingsRequest();
      interceptUploadCompanyLicenseRequest();
      interceptCreateBranchRequest();
      interceptCreateProfileRequest();

      clickSubFlow('Company Onboarding');
      cy.url().should('include', ROUTES.createCompany.path);

      getTestSelectorByModule(Module.createCompany, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.createCompany, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.createCompany, SubModule.companyDetails);
      interceptFetchCompanyRequest();
      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.createCompanySettings.path);

      clickFlowsIcon();

      cy.location('pathname').should('eq', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', false);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Settings', false);
      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', true);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', false);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Company Onboarding');
      selectColorScheme(Module.createCompanySettings, SubModule.companySettingsDetails, 'color-scheme-sunset');
      interceptFetchCompanySettingsRequest();
      clickActionButton(Module.createCompanySettings, SubModule.companySettingsDetails);

      cy.wait(['@createCompanySettingsRequest', '@fetchCompanySettingsRequest']);

      cy.url().should('include', ROUTES.uploadCompanyLicense.path);
      clickFlowsIcon();

      cy.location('pathname').should('eq', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', false);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Settings', false);
      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', true);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', false);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Company Onboarding');
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

      clickFlowsIcon();

      cy.location('pathname').should('eq', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', false);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Settings', false);
      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', true);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', false);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Company Onboarding');

      cy.url().should('include', ROUTES.createBranch.path);

      getTestSelectorByModule(Module.createBranch, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.createBranch, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.createBranch, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.createBranch, SubModule.branchDetails);
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', true);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Settings', false);
      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', true);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', false);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Employee Onboarding');
      cy.url().should('include', ROUTES.createEmployee.path);

      interceptFetchProfileRequest();
      clickActionButton(Module.createEmployee, SubModule.employeeDetails);
      cy.wait('@createProfileRequest');
      cy.wait('@fetchProfileRequest');

      cy.location('pathname').should('eq', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', true);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Settings', false);
      checkIsSubFlowDisabled('Company Offboarding', false);
      checkIsSubFlowDisabled('Branches', false);
      checkIsSubFlowDisabled('Departments', false);
      checkIsSubFlowDisabled('Employees', false);
      checkIsSubFlowDisabled('Employee Onboarding', true);
      checkIsSubFlowDisabled('View Profile', false);
      checkIsSubFlowDisabled('Employee Offboarding', false);
    });
  });
});
