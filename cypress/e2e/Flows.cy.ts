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

      // TODO: create separate test sets for different cases, e.g. onboarding started/completed

      it('should render the flows page', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        getTestSelectorByModule(Module.manage, SubModule.flows, 'page-title').should('have.text', 'Flows');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'page-subtitle').should('have.text', 'Manage Flows');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group', true).should('have.length', 4);
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Company').should('exist').and('have.text', 'Company');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Branches').should('exist').and('have.text', 'Branches');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Employees').should('exist').and('have.text', 'Employees');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Profile').should('exist').and('have.text', 'Profile');
      });

      it('should navigate correctly by urls from the flows page', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        enabledFlowRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', route);
        });
      });

      it('should not be able to navigate by urls from the flows page if the subflow is disabled', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        disabledFlowRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', ROUTES.flows.path);
        });
      });

      it('should navigate correctly manually from the flows page', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        clickFlowGroupMultipleSubFlows('Company', 'View Company');

        cy.url().should('include', ROUTES.viewCompany.path);
        cy.visit(ROUTES.flows.path);

        clickFlowGroupMultipleSubFlows('Branches', 'Branches');

        cy.url().should('include', ROUTES.branches.path);
        cy.visit(ROUTES.flows.path);

        clickFlowGroupMultipleSubFlows('Profile', 'View Profile');

        cy.url().should('include', ROUTES.viewProfile.path);
      });

      it('should navigate manually at once if the flow does not have multiple subflows', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-group-Employees').click();

        cy.url().should('include', ROUTES.employees.path);
      });

      it('should display correct enabled and disabled flows', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        checkIsFlowDisabled('Company', 'Set Company', true);
        checkIsFlowDisabled('Company', 'View Company', false);
        checkIsFlowDisabled('Branches', 'Set Branch', true);
        checkIsFlowDisabled('Branches', 'Branches', false);
        checkIsFlowDisabled('Profile', 'Set Employee', true);
        checkIsFlowDisabled('Profile', 'View Profile', false);
      });
    });
  });
});
