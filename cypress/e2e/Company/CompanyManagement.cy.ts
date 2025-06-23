import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  clickFlowsIcon,
  clickSubFlow,
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  selectColorScheme,
  selectNavigationMenuItem,
  selectOption,
  verifyFormValidationMessages,
  verifyNotExist,
  verifyRadioGroupValue,
  verifyTextFields,
} from '../../support/helpers';
import {
  interceptCreateCompanySettingsFailedRequest,
  interceptCreateCompanySettingsRequest,
  interceptEditCompanyFailedRequest,
  interceptEditCompanyFailedWithErrorRequest,
  interceptEditCompanyRequest,
  interceptEditCompanySettingsFailedRequest,
  interceptEditCompanySettingsRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsFailedRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../../support/interceptors';

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
          'view-details-label-id': 'ID',
          'view-details-label-name': 'Name',
          'view-details-value-name': 'Good Omens',
          'view-details-label-countryName': 'Country',
          'view-details-value-countryName': 'United States',
        });
        getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'copyable-field-label').should('not.exist');
        getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'copyable-field-value')
          .should('exist')
          .and('have.text', '111111111111');
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

    it('should not be able to navigate to the edit company page', () => {
      cy.visit(ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('not.exist');

      cy.visit(ROUTES.editCompany.path);

      cy.url().should('include', ROUTES.viewCompany.path);
    });

    it('should not be able to navigate to the company settings page', () => {
      cy.visit(ROUTES.companySettings.path);

      cy.url().should('include', ROUTES.viewCompany.path);
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      interceptFetchCompanyRequest();
      cy.loginMock(true);
    });

    it('should reset the form and navigate to view company page if the cancel button is clicked', () => {
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

    // TODO: flaky test
    it('should not be able to edit the company if the form is invalid or company update failed', () => {
      interceptEditCompanyFailedRequest();
      cy.visit(ROUTES.viewCompany.path);

      getTestSelectorByModule(Module.companyManagement, SubModule.companyViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', ROUTES.editCompany.path);

      cy.wait('@fetchCompanyRequest');

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

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Company');
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

    it('should be able to edit the company and be navigated to view company page if the form is valid and company update succeeded', () => {
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

      getTestSelectorByModule(Module.companyManagement, SubModule.companyDetails, 'form-action-button').should('have.attr', 'disabled');
      getLoadingButtonLoadingIcon(Module.companyManagement, SubModule.companyDetails, 'form-action-button').should('be.visible');
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

    it('should be able to navigate and view the company settings page and the default color scheme', () => {
      interceptFetchCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      cy.url().should('include', ROUTES.companySettings.path);

      getLinearLoader(Module.companyManagement, SubModule.companySettingsDetails, 'form').should('not.exist');
      cy.wait('@fetchCompanySettingsFailedRequest');

      getLinearLoader(Module.companyManagement, SubModule.companySettingsDetails, 'form').should('not.exist');

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-label', true).should(
        'have.length',
        6
      );
      verifyTextFields(Module.companyManagement, SubModule.companySettingsDetails, {
        'form-header': 'Company Settings Details',
        'form-section-field-colorScheme': 'Color Scheme',
        'color-scheme-label-midnight': 'Midnight',
        'color-scheme-label-forest': 'Forest',
        'color-scheme-label-ocean': 'Ocean',
        'color-scheme-label-sunset': 'Sunset',
        'color-scheme-label-sunrise': 'Sunrise',
        'color-scheme-label-lavender': 'Lavender',
      });
      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });

    it('should navigate to the Flows page and reset the form when the cancel button is clicked', () => {
      cy.visit(ROUTES.companySettings.path);

      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-sunset');
      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-cancel-button').should('exist').click();

      cy.location('pathname').should('eq', ROUTES.flows.path);

      clickSubFlow('Company Settings');

      cy.url().should('include', ROUTES.companySettings.path);

      verifyTextFields(Module.companyManagement, SubModule.companySettingsDetails, {
        'color-scheme-label-midnight': 'Midnight',
        'color-scheme-label-forest': 'Forest',
        'color-scheme-label-ocean': 'Ocean',
        'color-scheme-label-sunset': 'Sunset',
        'color-scheme-label-sunrise': 'Sunrise',
        'color-scheme-label-lavender': 'Lavender',
      });
      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });

    it('should display correct schemes and selected color when the theme mode is changed', () => {
      cy.visit(ROUTES.companySettings.path);

      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-label', true).should(
        'have.length',
        6
      );
      verifyTextFields(Module.companyManagement, SubModule.companySettingsDetails, {
        'color-scheme-label-midnight': 'Midnight',
        'color-scheme-label-forest': 'Forest',
        'color-scheme-label-ocean': 'Ocean',
        'color-scheme-label-sunset': 'Sunset',
        'color-scheme-label-sunrise': 'Sunrise',
        'color-scheme-label-lavender': 'Lavender',
      });
      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });

    it('should not apply the new color scheme if the company settings creation failed', () => {
      interceptFetchCompanySettingsFailedRequest();
      interceptCreateCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-sunrise');

      verifyRadioGroupValue('color-scheme-group', 'sunrise', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@createCompanySettingsFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to create a Company Settings');

      clickFlowsIcon();
      clickSubFlow('Company Settings');

      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });

    it('should apply the new color scheme if the company settings creation succeeded', () => {
      interceptFetchCompanySettingsFailedRequest();
      interceptCreateCompanySettingsRequest();
      cy.visit(ROUTES.companySettings.path);

      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-sunset');

      verifyRadioGroupValue('color-scheme-group', 'sunset', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      interceptFetchCompanySettingsRequest('fetchCompanySettingsRequest', 'company/company-settings-created');

      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@createCompanySettingsRequest');
      cy.wait('@fetchCompanySettingsRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company Settings has been successfully created');
      verifyRadioGroupValue('color-scheme-group', 'sunset', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });

    it('should not apply the new color scheme if the company settings update failed', () => {
      interceptFetchCompanySettingsRequest();
      interceptEditCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-lavender');

      verifyRadioGroupValue('color-scheme-group', 'lavender', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@editCompanySettingsFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Company Settings');
    });

    it('should apply the new color scheme if the company settings update succeeded', () => {
      interceptFetchCompanySettingsRequest();
      interceptEditCompanySettingsRequest();
      cy.visit(ROUTES.companySettings.path);

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-ocean');

      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      interceptFetchCompanySettingsRequest('fetchCompanySettingsRequest', 'company/company-settings-updated');

      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@editCompanySettingsRequest');
      cy.wait('@fetchCompanySettingsRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company Settings has been successfully updated');
      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });
  });
});
