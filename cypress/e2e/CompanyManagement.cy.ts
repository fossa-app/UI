import { Module, SubModule } from '../../src/shared/models';
import { clickActionButton, getLinearLoader, getLoadingButtonLoadingIcon, getTestSelectorByModule, selectOption } from '../support/helpers';
import {
  interceptEditCompanyFailedRequest,
  interceptEditCompanyRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const testCompanyFields = () => {
  getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-header').should(
    'have.text',
    'Company Details'
  );
  getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-item-label-name').should(
    'have.text',
    'Name'
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
};

const testCompanyLicenseFields = () => {
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-label-terms.licensee.longName'
  ).should('have.text', 'Long Name');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-value-terms.licensee.longName'
  ).should('have.text', 'Test Company Licensee');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-label-terms.licensee.shortName'
  ).should('have.text', 'Short Name');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-value-terms.licensee.shortName'
  ).should('have.text', 'TCL');
  getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details-item-label-terms.notBefore').should(
    'have.text',
    'Valid From'
  );
  getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details-item-value-terms.notBefore').should(
    'have.text',
    '9/1/2024'
  );
  getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details-item-label-terms.notAfter').should(
    'have.text',
    'Valid To'
  );
  getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details-item-value-terms.notAfter').should(
    'have.text',
    '9/1/2025'
  );
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-label-entitlements.companyId'
  ).should('have.text', 'Company ID');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-value-entitlements.companyId'
  ).should('have.text', '111111111111');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-label-entitlements.maximumBranchCount'
  ).should('have.text', 'Maximum Branch Count');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-value-entitlements.maximumBranchCount'
  ).should('have.text', '10');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-label-entitlements.maximumEmployeeCount'
  ).should('have.text', 'Maximum Employee Count');
  getTestSelectorByModule(
    Module.companyManagement,
    SubModule.companyLicenseViewDetails,
    'view-details-item-value-entitlements.maximumEmployeeCount'
  ).should('have.text', '100');
};

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
      cy.visit('/manage/company');

      cy.get('[data-cy="menu-icon"]').click();
      cy.get('[data-cy="menu-item-Company"]').click();

      cy.url().should('include', '/manage/company/view');
      testCompanyFields();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('not.exist');
    });

    it('should not be able to navigate to the edit company page', () => {
      cy.visit('/manage/company/view');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('not.exist');

      cy.visit('/manage/company/edit');

      cy.url().should('include', '/manage/company/view');
    });

    it('should be able to view the company license details', () => {
      cy.visit('/manage/company/view');
      interceptFetchCompanyLicenseRequest();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details-header').should(
        'have.text',
        'Company License Details'
      );
      testCompanyLicenseFields();
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock(true);
    });

    it('should be able to navigate and view the company page', () => {
      cy.visit('/manage/company');

      cy.get('[data-cy="menu-icon"]').click();
      cy.get('[data-cy="menu-item-Company"]').click();

      cy.url().should('include', '/manage/company/view');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-header').should(
        'have.text',
        'Company Details'
      );
      testCompanyFields();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist');
    });

    it('should reset the form and navigate to view company page if the cancel button is clicked', () => {
      cy.visit('/manage/company/view');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', '/manage/company/edit');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Changed');
      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'UA');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', '/manage/company/view');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .should('have.value', 'Good Omens');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-countryCode')
        .find('input')
        .should('have.value', 'US');
    });

    // TODO: flaky test
    it('should not be able to edit the company if the form is invalid or company updating failed', () => {
      interceptFetchCompanyRequest();
      interceptEditCompanyFailedRequest();
      cy.visit('/manage/company/view');

      cy.wait('@fetchCompanyRequest');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').should('not.have.attr', 'disabled');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();

      clickActionButton(Module.companyManagement, SubModule.companyDetails);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name-validation')
        .should('exist')
        .and('have.text', 'Company Name is required');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Fail Company Name');
      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'PL');

      clickActionButton(Module.companyManagement, SubModule.companyDetails);

      cy.wait('@editCompanyFailedRequest');

      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update Company');
    });

    it('should be able to edit the company and be navigated to view company page if the form is valid and company updating succeeded', () => {
      interceptEditCompanyRequest();
      cy.visit('/manage/company/view');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', '/manage/company/edit');

      cy.wait('@fetchCompanyRequest');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Updated');

      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'CA');

      interceptFetchCompanyRequest('fetchUpdatedCompanyRequest', 'company-updated');

      clickActionButton(Module.companyManagement, SubModule.companyDetails);

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
      cy.get('[data-cy="success-snackbar"]').should('exist').and('contain.text', 'Company has been successfully updated');
    });

    it('should be able to view the company license details', () => {
      cy.visit('/manage/company/view');
      interceptFetchCompanyLicenseRequest();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'view-details-header').should(
        'have.text',
        'Company License Details'
      );
      testCompanyLicenseFields();
    });
  });
});
