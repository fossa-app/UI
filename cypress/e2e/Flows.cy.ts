import { Module, SubModule } from 'shared/models';
import { ROUTES } from 'shared/constants';
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
  selectOption,
} from '../support/helpers';
import {
  interceptCreateBranchRequest,
  interceptCreateCompanyRequest,
  interceptCreateProfileRequest,
  interceptDeleteBranchRequest,
  interceptFetchBranchesFailedRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyFailedRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileFailedRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptLogoutRequest,
  interceptOpenidConfigurationRequest,
} from '../support/interceptors';

describe('Flows Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseRequest();
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
          checkIsSubFlowDisabled('Company Offboarding', true);
          checkIsSubFlowDisabled('Branches', true);
          checkIsSubFlowDisabled('Departments', false);
          checkIsSubFlowDisabled('Employees', true);
          checkIsSubFlowDisabled('Employee Onboarding', true);
          checkIsSubFlowDisabled('View Profile', true);
          checkIsSubFlowDisabled('Employee Offboarding', true);
        });

        it('should display correct enabled and disabled subFlows if the Company Onboarding has completed', () => {
          interceptFetchCompanyRequest();
          interceptFetchBranchesRequest();
          interceptFetchProfileFailedRequest();

          checkIsSubFlowDisabled('Company Onboarding', true);
          checkIsSubFlowDisabled('View Company', false);
          checkIsSubFlowDisabled('Company Offboarding', true);
          checkIsSubFlowDisabled('Branches', false);
          checkIsSubFlowDisabled('Departments', false);
          checkIsSubFlowDisabled('Employees', true);
          checkIsSubFlowDisabled('Employee Onboarding', false);
          checkIsSubFlowDisabled('View Profile', true);
          checkIsSubFlowDisabled('Employee Offboarding', true);
        });
      });

      describe('Onboarding Completed Tests', () => {
        beforeEach(() => {
          interceptFetchCompanyRequest();
          interceptFetchBranchesRequest();
          interceptFetchProfileRequest();
        });

        it('should render the flows page', () => {
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

        it('should navigate correctly by urls from the flows page', () => {
          [ROUTES.viewCompany.path, ROUTES.branches.path, ROUTES.employees.path, ROUTES.viewProfile.path].forEach((route) => {
            cy.visit(route);
            cy.url().should('include', route);
          });
        });

        it('should not be able to navigate by urls from the flows page if the subflow is disabled', () => {
          [ROUTES.companyOnboarding.path, ROUTES.setBranch.path, ROUTES.employeeOnbarding.path].forEach((route) => {
            cy.visit(route);
            cy.url().should('include', ROUTES.flows.path);
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

        it('should correctly navigate manually from the flows page', () => {
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
          checkIsSubFlowDisabled('Company Offboarding', true);
          checkIsSubFlowDisabled('Branches', false);
          checkIsSubFlowDisabled('Departments', false);
          checkIsSubFlowDisabled('Employees', false);
          checkIsSubFlowDisabled('Employee Onboarding', true);
          checkIsSubFlowDisabled('View Profile', false);
          checkIsSubFlowDisabled('Employee Offboarding', true);
        });

        it('should navigate to the flows page if the flows navigation icon is clicked', () => {
          cy.visit(ROUTES.viewCompany.path);
          clickFlowsIcon();

          cy.url().should('include', ROUTES.flows.path);
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
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      interceptDeleteBranchRequest('222222222222');

      clickSubFlow('Branches');
      cy.url().should('include', ROUTES.branches.path);

      selectAction(Module.branchManagement, SubModule.branchTable, 'delete', '222222222222');
      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetchNoBranchesRequest', fixture: 'branch/branches-empty' });
      cy.wait('@deleteBranchRequest');
      cy.wait('@fetchBranchesRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-body-row', true).should('have.length', 0);
      clickFlowsIcon();

      cy.url().should('include', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', false);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Offboarding', true);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', false);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', true);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Company Onboarding');

      cy.url().should('include', ROUTES.setBranch.path);
    });

    it('should display correct enabled and disabled subFlows when in different onboarding flows', () => {
      interceptFetchCompanyFailedRequest();
      interceptFetchBranchesFailedRequest();
      interceptCreateCompanyRequest();
      interceptCreateBranchRequest();
      interceptCreateProfileRequest();

      clickSubFlow('Company Onboarding');
      cy.url().should('include', ROUTES.companyOnboarding.path);

      getTestSelectorByModule(Module.companySetup, SubModule.companyDetails, 'form-field-name').type('Good Omens');
      selectOption(Module.companySetup, SubModule.companyDetails, 'countryCode', 'US');
      clickActionButton(Module.companySetup, SubModule.companyDetails);
      interceptFetchCompanyRequest();
      cy.wait('@createCompanyRequest');
      cy.wait('@fetchCompanyRequest');

      cy.url().should('include', ROUTES.setBranch.path);
      clickFlowsIcon();

      cy.url().should('include', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', false);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Offboarding', true);
      checkIsSubFlowDisabled('Branches', true);
      checkIsSubFlowDisabled('Departments', false);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', true);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Company Onboarding');
      cy.url().should('include', ROUTES.setBranch.path);

      getTestSelectorByModule(Module.branchSetup, SubModule.branchDetails, 'form-field-name').type('America/New_York');
      selectOption(Module.branchSetup, SubModule.branchDetails, 'timeZoneId', 'America/New_York');
      clickField(Module.branchSetup, SubModule.branchDetails, 'form-field-noPhysicalAddress');
      clickActionButton(Module.branchSetup, SubModule.branchDetails);
      interceptFetchBranchesRequest();
      interceptFetchProfileFailedRequest();
      cy.wait('@createBranchRequest');
      cy.wait('@fetchBranchesRequest');
      cy.wait('@fetchProfileFailedRequest');

      cy.url().should('include', ROUTES.employeeOnbarding.path);
      clickFlowsIcon();

      cy.url().should('include', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', true);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Offboarding', true);
      checkIsSubFlowDisabled('Branches', false);
      checkIsSubFlowDisabled('Departments', false);
      checkIsSubFlowDisabled('Employees', true);
      checkIsSubFlowDisabled('Employee Onboarding', false);
      checkIsSubFlowDisabled('View Profile', true);
      checkIsSubFlowDisabled('Employee Offboarding', true);

      clickSubFlow('Employee Onboarding');
      cy.url().should('include', ROUTES.employeeOnbarding.path);

      interceptFetchProfileRequest();
      clickActionButton(Module.employeeSetup, SubModule.employeeDetails);
      cy.wait('@createProfileRequest');
      cy.wait('@fetchProfileRequest');

      cy.url().should('include', ROUTES.flows.path);
      checkIsSubFlowDisabled('Company Onboarding', true);
      checkIsSubFlowDisabled('View Company', false);
      checkIsSubFlowDisabled('Company Offboarding', true);
      checkIsSubFlowDisabled('Branches', false);
      checkIsSubFlowDisabled('Departments', false);
      checkIsSubFlowDisabled('Employees', false);
      checkIsSubFlowDisabled('Employee Onboarding', true);
      checkIsSubFlowDisabled('View Profile', false);
      checkIsSubFlowDisabled('Employee Offboarding', true);
    });
  });
});
