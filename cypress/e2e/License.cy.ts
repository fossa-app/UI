import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchCompanyLicenseRequest,
  interceptUploadCompanyLicenseFailedRequest,
  interceptFetchCompanyLicenseFailedRequest,
} from 'support/interceptors';

describe('License Tests', () => {
  beforeEach(() => {
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
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should fetch and display correct system license and not display company license if not logged in', () => {
        cy.visit(ROUTES.login.path);

        cy.wait('@fetchSystemLicenseRequest');

        getTestSelectorByModule(Module.shared, SubModule.license, 'system-license').should('exist').and('have.text', 'TSL');

        getTestSelectorByModule(Module.shared, SubModule.license, 'system-license').trigger('mouseover');

        cy.get('.MuiTooltip-tooltip').should('exist').and('have.text', 'Test System Licensee');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');
      });

      it('should not display the company license if the onboarding has not been completed', () => {
        interceptFetchCompanyRequest();
        interceptFetchCompanyLicenseFailedRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchProfileRequest();
        interceptUploadCompanyLicenseFailedRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');
      });

      it('should display correct company license if the company license has been successfully uploaded', () => {
        interceptFetchCompanyRequest();
        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 });
        interceptFetchProfileRequest();
        interceptFetchCompanyLicenseRequest();
        cy.visit(ROUTES.company.path);

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('not.exist');

        cy.wait('@fetchCompanyLicenseRequest');

        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').should('exist').and('have.text', 'TCL');
        getTestSelectorByModule(Module.shared, SubModule.license, 'company-license-text').trigger('mouseover');

        cy.get('.MuiTooltip-tooltip').should('exist').and('have.text', 'Test Company Licensee');
      });
    });
  });
});
