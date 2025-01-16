import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getLoadingButtonLoadingIcon, getTestSelectorByModule, selectOption } from '../support/helpers';
import {
  interceptEditCompanyFailedRequest,
  interceptEditCompanyRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

describe('Company Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
  });

  describe('User Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock();
    });

    it('should be able to navigate and view the company page', () => {
      cy.visit('/manage/dashboard');

      cy.get('[data-cy="menu-icon"]').click();
      cy.get('[data-cy="menu-item-Company"]').click();

      cy.url().should('include', '/manage/company/view');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-header').should(
        'have.text',
        'Company Details'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-label-name').should(
        'have.text',
        'Company Name'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-value-name').should(
        'have.text',
        'Good Omens'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-label-countryName').should(
        'have.text',
        'Country'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-value-countryName').should(
        'have.text',
        'United States'
      );
      cy.get('[data-cy="edit-company-button"]').should('not.exist');
    });

    it('should not be able to navigate to the edit company page', () => {
      cy.visit('/manage/company/view');

      cy.get('[data-cy="edit-company-button"]').should('not.exist');

      cy.visit('/manage/company/edit');

      cy.url().should('include', '/manage/company/view');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock(true);
    });

    it('should be able to navigate and view the company page', () => {
      cy.visit('/manage/dashboard');

      cy.get('[data-cy="menu-icon"]').click();
      cy.get('[data-cy="menu-item-Company"]').click();

      cy.url().should('include', '/manage/company/view');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-header').should(
        'have.text',
        'Company Details'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-label-name').should(
        'have.text',
        'Company Name'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-value-name').should(
        'have.text',
        'Good Omens'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-label-countryName').should(
        'have.text',
        'Country'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-value-countryName').should(
        'have.text',
        'United States'
      );
      cy.get('[data-cy="edit-company-button"]').should('exist');
    });

    it('should reset the form and navigate to view company page if the cancel button is clicked', () => {
      cy.visit('/manage/company/view');

      cy.get('[data-cy="edit-company-button"]').should('exist').click();

      cy.url().should('include', '/manage/company/edit');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Changed');
      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'UA');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', '/manage/company/view');

      cy.get('[data-cy="edit-company-button"]').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .should('have.value', 'Good Omens');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-countryCode')
        .find('input')
        .should('have.value', 'US');
    });

    // TODO: flaky test
    it('should not be able to edit the company if the form is invalid or company updating failed', () => {
      interceptEditCompanyFailedRequest();
      cy.visit('/manage/company/view');

      cy.get('[data-cy="edit-company-button"]').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'Company Name is required');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Fail Company Name');
      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'PL');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').click();

      cy.wait('@editCompanyFailedRequest');

      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update Company');
    });

    it('should be able to edit the company and be navigated to view company page if the form is valid and company updating succeeded', () => {
      interceptEditCompanyRequest();
      cy.visit('/manage/company/view');

      cy.get('[data-cy="edit-company-button"]').should('exist').click();

      cy.url().should('include', '/manage/company/edit');

      cy.wait('@fetchCompanyRequest');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Updated');

      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'CA');

      interceptFetchCompanyRequest('fetchUpdatedCompanyRequest', 'company-updated');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
      getLoadingButtonLoadingIcon(Module.companyManagement, SubModule.companyDetails, 'form-action-button').should('be.visible');
      getLinearLoader(Module.companyManagement, SubModule.companyViewDetails, 'view-details').should('exist');

      cy.wait('@editCompanyRequest');
      cy.wait('@fetchUpdatedCompanyRequest');

      cy.url().should('include', '/manage/company/view');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-value-name').should(
        'have.text',
        'Good Omens Updated'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-value-countryName').should(
        'have.text',
        'Canada'
      );
    });
  });
});
