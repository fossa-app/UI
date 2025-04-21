import { Module, SubModule } from 'shared/models';
import { ROUTES } from 'shared/constants';
import { checkIsFlowDisabled, clickFlowGroupMultipleSubFlows, getTestSelectorByModule } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const enabledFlowRoutes = [ROUTES.viewCompany.path, ROUTES.branches.path, ROUTES.employees.path, ROUTES.viewProfile.path];
const disabledFlowRoutes = [ROUTES.setCompany.path, ROUTES.setBranch.path, ROUTES.setEmployee.path];

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
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      // TODO: add test case that hides the flows-icon if unauthorized
      // TODO: add test cases for each onboarding scenario

      describe('Setup Completed Tests', () => {
        beforeEach(() => {
          interceptFetchCompanyRequest();
          interceptFetchBranchesRequest();
          interceptFetchProfileRequest();
          cy.visit(ROUTES.flows.path);
        });

        it('should render the flows page', () => {
          getTestSelectorByModule(Module.manage, SubModule.flows, 'page-title').should('have.text', 'Flows');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'page-subtitle').should('have.text', 'Manage Flows');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group', true).should('have.length', 4);
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Company').should('exist').and('have.text', 'Company');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Branches').should('exist').and('have.text', 'Branches');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Employees').should('exist').and('have.text', 'Employees');
          getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Profile').should('exist').and('have.text', 'Profile');
        });

        it('should navigate correctly by urls from the flows page', () => {
          enabledFlowRoutes.forEach((route) => {
            cy.visit(route);
            cy.url().should('include', route);
          });
        });

        it('should not be able to navigate by urls from the flows page if the subflow is disabled', () => {
          disabledFlowRoutes.forEach((route) => {
            cy.visit(route);
            cy.url().should('include', ROUTES.flows.path);
          });
        });

        it('should correctly navigate manually from the flows page', () => {
          clickFlowGroupMultipleSubFlows('Company', 'View Company');

          cy.url().should('include', ROUTES.viewCompany.path);
          cy.visit(ROUTES.flows.path);

          clickFlowGroupMultipleSubFlows('Branches', 'Branches');

          cy.url().should('include', ROUTES.branches.path);
          cy.visit(ROUTES.flows.path);

          clickFlowGroupMultipleSubFlows('Employees', 'Employees');

          cy.url().should('include', ROUTES.employees.path);
          cy.visit(ROUTES.flows.path);

          clickFlowGroupMultipleSubFlows('Profile', 'View Profile');

          cy.url().should('include', ROUTES.viewProfile.path);
        });

        it('should display correct enabled and disabled flows', () => {
          checkIsFlowDisabled('Company', 'Company Onboarding', true);
          checkIsFlowDisabled('Company', 'View Company', false);
          checkIsFlowDisabled('Branches', 'Branches', false);
          checkIsFlowDisabled('Profile', 'Employee Onboarding', true);
          checkIsFlowDisabled('Profile', 'View Profile', false);
        });

        it('should navigate to the flows page if the flows navigation icon is clicked', () => {
          cy.visit(ROUTES.viewCompany.path);
          getTestSelectorByModule(Module.shared, SubModule.header, 'flows-icon').click();

          cy.url().should('include', ROUTES.flows.path);
        });
      });
    });
  });
});
