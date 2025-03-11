import { Module, SubModule } from '../../src/shared/models';
import {
  clickActionButton,
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  selectOption,
  verifyNotExist,
  verifyTextFields,
} from '../support/helpers';
import {
  interceptEditCompanyFailedRequest,
  interceptEditCompanyRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const testCompaLicenseFields = () => {
  verifyTextFields(Module.companyManagement, SubModule.companyLicenseViewDetails, {
    'view-details-header': 'Company License Details',
    'view-details-section-terms': 'Terms',
    'view-details-section-entitlements': 'Entitlements',
    'view-details-label-terms.licensee.longName': 'Long Name',
    'view-details-value-terms.licensee.longName': 'Test Company Licensee',
    'view-details-label-terms.licensee.shortName': 'Short Name',
    'view-details-value-terms.licensee.shortName': 'TCL',
    'view-details-label-terms.notBefore': 'Valid From',
    'view-details-value-terms.notBefore': '9/1/2024',
    'view-details-label-terms.notAfter': 'Valid To',
    'view-details-value-terms.notAfter': '9/1/2025',
    'view-details-label-entitlements.maximumBranchCount': 'Maximum Branch Count',
    'view-details-value-entitlements.maximumBranchCount': '10',
    'view-details-label-entitlements.maximumEmployeeCount': 'Maximum Employee Count',
    'view-details-value-entitlements.maximumEmployeeCount': '100',
  });
};

const testCompaLicenseFieldsNotExist = () => {
  verifyNotExist(Module.companyManagement, SubModule.companyLicenseViewDetails, [
    'view-details-section-terms',
    'view-details-section-entitlements',
    'view-details-label-terms.licensee.longName',
    'view-details-value-terms.licensee.longName',
    'view-details-label-terms.licensee.shortName',
    'view-details-value-terms.licensee.shortName',
    'view-details-label-terms.notBefore',
    'view-details-value-terms.notBefore',
    'view-details-label-terms.notAfter',
    'view-details-value-terms.notAfter',
    'view-details-label-entitlements.maximumBranchCount',
    'view-details-value-entitlements.maximumBranchCount',
    'view-details-label-entitlements.maximumEmployeeCount',
    'view-details-value-entitlements.maximumEmployeeCount',
  ]);
};

describe('Company Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchBranchesRequest();
    interceptFetchProfileRequest();
    interceptFetchCompanyRequest();
  });

  const roles = [
    {
      role: 'User',
      loginMock: () => cy.loginMock(),
      viewActionButtonExists: false,
    },
    {
      role: 'Admin',
      loginMock: () => cy.loginMock(true),
      viewActionButtonExists: true,
    },
  ];

  roles.forEach(({ role, loginMock, viewActionButtonExists }) => {
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should be able to navigate and view the company page', () => {
        cy.visit('/manage/company');

        cy.get('[data-cy="menu-icon"]').click();
        cy.get('[data-cy="menu-item-Company"]').click();

        cy.url().should('include', '/manage/company/view');
        verifyTextFields(Module.companyManagement, SubModule.companyViewDetails, {
          'view-details-header': 'Company Details',
          'view-details-section-basicInfo': 'Basic Information',
          'view-details-label-name': 'Name',
          'view-details-value-name': 'Good Omens',
          'view-details-label-countryName': 'Country',
          'view-details-value-countryName': 'United States',
        });
        getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should(
          viewActionButtonExists ? 'exist' : 'not.exist'
        );
      });

      it('should be able to view the company license details', () => {
        cy.visit('/manage/company/view');
        interceptFetchCompanyLicenseRequest();

        testCompaLicenseFields();
      });

      it('should display a default template if the company license has not been uploaded', () => {
        cy.visit('/manage/company/view');
        interceptFetchCompanyLicenseFailedRequest();

        verifyTextFields(Module.companyManagement, SubModule.companyLicenseViewDetails, {
          'view-details-header': 'Company License Details',
        });
        testCompaLicenseFieldsNotExist();
        getTestSelectorByModule(Module.companyManagement, SubModule.companyLicenseViewDetails, 'page-subtitle')
          .should('exist')
          .and('have.text', 'Company License has not been uploaded.');
      });
    });
  });

  describe('User Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock();
    });

    it('should not be able to navigate to the edit company page', () => {
      cy.visit('/manage/company/view');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('not.exist');

      cy.visit('/manage/company/edit');

      cy.url().should('include', '/manage/company/view');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock(true);
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
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-value-name').should(
        'have.text',
        'Good Omens Updated'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-value-countryName').should(
        'have.text',
        'Canada'
      );
      cy.get('[data-cy="success-snackbar"]').should('exist').and('contain.text', 'Company has been successfully updated');
    });
  });
});
