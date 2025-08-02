import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  selectNavigationMenuItem,
  selectOption,
  verifyFormValidationMessages,
  verifyNotExist,
  verifyTextFields,
} from 'support/helpers';
import {
  interceptEditCompanyFailedRequest,
  interceptEditCompanyFailedWithErrorRequest,
  interceptEditCompanyRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from 'support/interceptors';

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
    'view-details-label-entitlements.maximumDepartmentCount': 'Maximum Department Count',
    'view-details-value-entitlements.maximumDepartmentCount': '20',
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
    'view-details-label-entitlements.maximumDepartmentCount',
    'view-details-value-entitlements.maximumDepartmentCount',
  ]);
};

describe('Company Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchOnboardingBranchesRequest' });
    interceptFetchProfileRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
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
        cy.visit(ROUTES.company.path);

        selectNavigationMenuItem('Company');

        cy.url().should('include', ROUTES.viewCompany.path);
        verifyTextFields(Module.companyManagement, SubModule.companyViewDetails, {
          'view-details-header': 'Company Details',
          'view-details-section-basicInfo': 'Basic Information',
          'view-details-label-name': 'Name',
          'view-details-value-name': 'Good Omens',
          'view-details-label-countryName': 'Country',
          'view-details-value-countryName': 'United States',
          'copyable-field-label': 'ID',
          'copyable-field-value': '111111111111',
        });
        getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should(
          viewActionButtonExists ? 'exist' : 'not.exist'
        );
      });

      it('should be able to view the company license details', () => {
        cy.visit(ROUTES.viewCompany.path);
        interceptFetchCompanyLicenseRequest();

        testCompaLicenseFields();
      });

      it('should display a default template if the company license has not been uploaded', () => {
        cy.visit(ROUTES.viewCompany.path);
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

    it('should not be able to navigate to the Edit Company page', () => {
      cy.visit(ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('not.exist');

      cy.visit(ROUTES.editCompany.path);

      cy.url().should('include', ROUTES.viewCompany.path);
    });

    it('should not be able to navigate to the Company Settings page', () => {
      cy.visit(ROUTES.companySettings.path);

      cy.url().should('include', ROUTES.viewCompany.path);
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock(true);
    });

    it('should reset the form and navigate to the View Company page if the cancel button is clicked', () => {
      cy.visit(ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', ROUTES.editCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Changed');
      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'UA');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .should('have.value', 'Good Omens');
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-countryCode')
        .find('input')
        .should('have.value', 'US');
    });

    it('should not be able to edit the company if the form is invalid or company update failed', () => {
      interceptEditCompanyFailedRequest();
      cy.visit(ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', ROUTES.editCompany.path);

      cy.wait('@fetchCompanyRequest');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-submit-button').should('not.have.attr', 'disabled');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .should('have.value', 'Good Omens')
        .clear();

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

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Company');
      cy.url().should('include', ROUTES.editCompany.path);
    });

    it('should display async validation messages if the company update failed with validation errors', () => {
      interceptEditCompanyFailedWithErrorRequest();
      cy.visit(ROUTES.editCompany.path);

      cy.wait('@fetchCompanyRequest');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Updated');
      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'DE');

      clickActionButton(Module.companyManagement, SubModule.companyDetails);

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Company');
      verifyFormValidationMessages(Module.companyManagement, SubModule.companyDetails, [
        {
          field: 'form-field-name-validation',
          message: `Company 'Good Omens Updated' already exists in the system.`,
        },
      ]);
      cy.url().should('include', ROUTES.editCompany.path);
    });

    it('should be able to edit the company and be navigated to the View Company page if the form is valid and company update succeeded', () => {
      interceptEditCompanyRequest();
      cy.visit(ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', ROUTES.editCompany.path);

      cy.wait('@fetchCompanyRequest');

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name').find('input').clear();
      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-field-name')
        .find('input')
        .type('Good Omens Updated');

      selectOption(Module.companyManagement, SubModule.companyDetails, 'countryCode', 'CA');

      interceptFetchCompanyRequest('fetchUpdatedCompanyRequest', 'company/company-updated');

      clickActionButton(Module.companyManagement, SubModule.companyDetails);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-submit-button').should('have.attr', 'disabled');
      getLoadingButtonLoadingIcon(Module.companyManagement, SubModule.companyDetails, 'form-submit-button').should('be.visible');
      getLinearLoader(Module.companyManagement, SubModule.companyViewDetails, 'view-details').should('exist');

      cy.wait('@editCompanyRequest');
      cy.wait('@fetchUpdatedCompanyRequest');

      cy.url().should('include', ROUTES.viewCompany.path);
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-value-name').should(
        'have.text',
        'Good Omens Updated'
      );
      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-details-value-countryName').should(
        'have.text',
        'Canada'
      );
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company has been successfully updated');
    });
  });
});
