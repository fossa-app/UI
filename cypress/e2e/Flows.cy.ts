import { Module, SubModule } from 'shared/models';
import { ROUTES } from 'shared/constants';
import { getTestSelectorByModule } from '../support/helpers';
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
        cy.visit('/manage');

        getTestSelectorByModule(Module.manage, SubModule.flows, 'page-title').should('have.text', 'Flows');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'page-subtitle').should('have.text', 'Manage Flows');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item', true).should('have.length', 4);
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Company').should('exist');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Branches').should('exist');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Employees').should('exist');
        getTestSelectorByModule(Module.manage, SubModule.flows, 'flow-item-Profile').should('exist');
      });

      it('should navigate correctly from the flows page', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest();
        interceptFetchProfileRequest();
        cy.visit('/manage');

        flowRoutes.forEach((route) => {
          cy.visit(route);
          cy.url().should('include', route);
        });
      });
    });
  });
});
