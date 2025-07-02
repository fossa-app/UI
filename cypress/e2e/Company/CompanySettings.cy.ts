import { COMPANY_SETTINGS_KEY, ROUTES } from '../../../src/shared/constants';
import { Module, SubModule } from '../../../src/shared/models';
import {
  clickActionButton,
  clickFlowsIcon,
  clickSubFlow,
  getLinearLoader,
  getTestSelectorByModule,
  selectColorScheme,
  verifyRadioGroupValue,
  verifyTextFields,
} from '../../support/helpers';
import {
  interceptCreateCompanySettingsFailedRequest,
  interceptCreateCompanySettingsRequest,
  interceptDeleteCompanySettingsFailedRequest,
  interceptDeleteCompanySettingsRequest,
  interceptEditCompanySettingsFailedRequest,
  interceptEditCompanySettingsRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsFailedRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptLogoutRequest,
  interceptOpenidConfigurationRequest,
} from '../../support/interceptors';

describe('Company Settings Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchOnboardingBranchesRequest' });
    interceptFetchProfileRequest();
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
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

    it('should not create a new color scheme if the company settings creation failed', () => {
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

    it('should create a new color scheme if the company settings creation succeeded', () => {
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

    it('should not update the color scheme if the company settings update failed', () => {
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

    it('should update the color scheme if the company settings update succeeded', () => {
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

    it('should disable the delete company settings button if there is no company settings available', () => {
      interceptFetchCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-delete-button').should(
        'have.attr',
        'disabled'
      );
    });

    it('should not delete the color scheme if the company settings deletion failed', () => {
      interceptFetchCompanySettingsRequest('fetchCompanySettingsRequest', 'company/company-settings-updated');
      interceptDeleteCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-delete-button').click();
      cy.wait('@deleteCompanySettingsFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to delete the Company Settings');
      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
    });

    it('should delete the color scheme if the company settings deletion succeeded', () => {
      interceptFetchCompanySettingsRequest('fetchCompanySettingsRequest', 'company/company-settings-updated');
      interceptDeleteCompanySettingsRequest();
      cy.visit(ROUTES.companySettings.path);

      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);

      interceptFetchCompanySettingsRequest();

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-delete-button').click();
      cy.wait('@deleteCompanySettingsRequest');
      cy.wait('@fetchCompanySettingsRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company Settings has been successfully deleted');
      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-delete-button').should(
        'have.attr',
        'disabled'
      );
    });

    it('should store default settings in the localstorage and apply the stored color scheme after logout', () => {
      interceptFetchCompanySettingsRequest();
      interceptEditCompanySettingsRequest();
      interceptDeleteCompanySettingsRequest();
      interceptOpenidConfigurationRequest();
      interceptLogoutRequest();
      cy.visit(ROUTES.companySettings.path);

      cy.window().then((win) => {
        const stored = win.localStorage.getItem(COMPANY_SETTINGS_KEY);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(stored).to.be.null;
      });

      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-ocean');
      interceptFetchCompanySettingsRequest('fetchCompanySettingsUpdatedRequest', 'company/company-settings-updated');
      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@editCompanySettingsRequest');
      cy.wait('@fetchCompanySettingsUpdatedRequest');

      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      cy.window().then((win) => {
        const stored = win.localStorage.getItem(COMPANY_SETTINGS_KEY);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(stored).to.not.be.null;

        const parsed = JSON.parse(stored!);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(parsed.colorSchemeId).to.equal('ocean');
      });

      getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();
      getTestSelectorByModule(Module.shared, SubModule.header, 'logout-button').click();

      cy.logoutMock();
      cy.wait('@openidConfigurationRequest');
      cy.wait('@logoutRequest');

      cy.window().then((win) => {
        const stored = win.localStorage.getItem(COMPANY_SETTINGS_KEY);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(stored).to.not.be.null;

        const parsed = JSON.parse(stored!);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(parsed.colorSchemeId).to.equal('ocean');
      });

      cy.loginMock(true);
      cy.visit(ROUTES.companySettings.path);

      interceptFetchCompanySettingsRequest('fetchCompanySettingsUpdatedSecondRequest', 'company/company-settings-updated');

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-delete-button').click();
      cy.wait('@deleteCompanySettingsRequest');
      cy.wait('@fetchCompanySettingsUpdatedSecondRequest');

      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      cy.window().then((win) => {
        const stored = win.localStorage.getItem(COMPANY_SETTINGS_KEY);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(stored).to.not.be.null;

        const parsed = JSON.parse(stored!);
        // @ts-expect-error Jest types are leaking into Cypress context; expect is not typed as Chai
        expect(parsed.colorSchemeId).to.equal('midnight');
      });
    });
  });
});
