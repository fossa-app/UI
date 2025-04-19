import { Module, SubModule } from 'shared/models';
import { ROUTES } from 'shared/constants';
import { clickFlowGroup, getTestSelectorByModule } from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const flowRoutes = [ROUTES.viewCompany.path, ROUTES.branches.path, ROUTES.employees.path, ROUTES.viewProfile.path];

describe('Flows Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
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

        flowRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', route);
        });
      });

      it('should navigate correctly manually from the flows page', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit(ROUTES.flows.path);

        clickFlowGroup('Company', 'View Company');

        cy.url().should('include', ROUTES.viewCompany.path);
        cy.visit(ROUTES.flows.path);

        clickFlowGroup('Branches', 'Branches');

        cy.url().should('include', ROUTES.branches.path);

        cy.visit(ROUTES.flows.path);

        clickFlowGroup('Employees', 'Employees');

        cy.url().should('include', ROUTES.employees.path);

        cy.visit(ROUTES.flows.path);

        clickFlowGroup('Profile', 'View Profile');

        cy.url().should('include', ROUTES.viewProfile.path);
      });
    });
  });
});
