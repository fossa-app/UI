import { COMPANY_SETTINGS_KEY, ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  clickFlowsIcon,
  clickSubFlow,
  getLinearLoader,
  getTestSelectorByModule,
  selectColorScheme,
  verifyAppTheme,
  verifyRadioGroupValue,
  verifyTextFields,
} from 'support/helpers';
import {
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
} from 'support/interceptors';

describe('Company Settings Tests', () => {
  beforeEach(() => {
    cy.mockDarkTheme();
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
    interceptFetchProfileRequest();
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should not be able to navigate to the Company Settings page if the company settings do not exist', () => {
      interceptFetchCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      cy.location('pathname').should('eq', ROUTES.flows.path);
    });

    it('should be able to navigate and view the Company Settings page and the default color scheme if the company settings exist', () => {
      cy.visit(ROUTES.companySettings.path);

      cy.url().should('include', ROUTES.companySettings.path);

      getLinearLoader(Module.companyManagement, SubModule.companySettingsDetails, 'form').should('not.exist');
      cy.wait('@fetchCompanySettingsRequest');

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
      verifyAppTheme('dark', 'midnight');
    });

    it('should navigate to the Flows page and reset the form when the cancel button is clicked', () => {
      cy.visit(ROUTES.companySettings.path);

      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('dark', 'midnight');

      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-sunset');

      verifyAppTheme('dark', 'sunset');
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
      verifyAppTheme('dark', 'midnight');
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
      verifyAppTheme('light', 'midnight');
    });

    it('should not update the color scheme if the company settings update failed', () => {
      interceptEditCompanySettingsFailedRequest();
      cy.visit(ROUTES.companySettings.path);

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-lavender');

      verifyRadioGroupValue('color-scheme-group', 'lavender', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('light', 'lavender');

      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@editCompanySettingsFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Company Settings');
    });

    it('should update the color scheme if the company settings update succeeded', () => {
      interceptEditCompanySettingsRequest();
      cy.visit(ROUTES.companySettings.path);

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-ocean');

      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('light', 'ocean');

      interceptFetchCompanySettingsRequest('fetchCompanySettingsRequest', 'company/company-settings-updated');

      clickActionButton(Module.companyManagement, SubModule.companySettingsDetails);
      cy.wait('@editCompanySettingsRequest');
      cy.wait('@fetchCompanySettingsRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Company Settings has been successfully updated');
      verifyRadioGroupValue('color-scheme-group', 'ocean', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('light', 'ocean');
    });

    it('should store default settings in the localstorage and apply the stored color scheme after logout', () => {
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
      verifyAppTheme('dark', 'ocean');
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

      verifyAppTheme('dark', 'ocean');
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
    });

    it('should preview the color scheme when the company settings color scheme is changed', () => {
      cy.visit(ROUTES.companySettings.path);

      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-forest');

      verifyRadioGroupValue('color-scheme-group', 'forest', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('dark', 'forest');

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-sunset');

      verifyRadioGroupValue('color-scheme-group', 'sunset', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('light', 'sunset');

      getTestSelectorByModule(Module.shared, SubModule.header, 'theme-button').click();
      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-lavender');

      verifyRadioGroupValue('color-scheme-group', 'lavender', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('dark', 'lavender');

      getTestSelectorByModule(Module.companyManagement, SubModule.companySettingsDetails, 'form-cancel-button').click();

      cy.location('pathname').should('eq', ROUTES.flows.path);
      verifyAppTheme('dark', 'midnight');

      clickSubFlow('Company Settings');

      cy.url().should('include', ROUTES.companySettings.path);
      verifyRadioGroupValue('color-scheme-group', 'midnight', ['midnight', 'ocean', 'sunset', 'sunrise', 'forest', 'lavender']);
      verifyAppTheme('dark', 'midnight');

      selectColorScheme(Module.companyManagement, SubModule.companySettingsDetails, 'color-scheme-sunrise');
      clickFlowsIcon();

      cy.location('pathname').should('eq', ROUTES.flows.path);
      verifyAppTheme('dark', 'midnight');
    });
  });
});
