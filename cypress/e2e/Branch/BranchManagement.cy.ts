import { ROUTES } from '../../../src/shared/constants';
import { Module, SubModule } from '../../../src/shared/models';
import {
  clearBranchDetailsForm,
  fillBranchDetailsForm,
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  clickField,
  selectOption,
  verifyInputFields,
  verifyFormValidationMessages,
  clickActionButton,
  verifyNotExist,
  verifyOptions,
  verifyBranchDetailsFormFieldsExist,
  verifyBranchDetailsFormFieldsNotExist,
  verifyTextFields,
  selectAction,
  selectNavigationMenuItem,
} from '../../support/helpers';
import {
  interceptCreateBranchFailedRequest,
  interceptCreateBranchFailedWithErrorRequest,
  interceptCreateBranchRequest,
  interceptEditBranchFailedRequest,
  interceptEditBranchFailedWithErrorRequest,
  interceptEditBranchRequest,
  interceptFetchBranchByIdFailedRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesByIdsRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchEmployeesRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../../support/interceptors';

describe('Branch Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchOnboardingBranchesRequest' });
    interceptFetchProfileRequest();
    cy.loginMock(true);
  });

  it('should display an empty form on branch creation page', () => {
    cy.visit(ROUTES.newBranch.path);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').should('not.have.value');

    cy.visit(ROUTES.branches.path);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').should('not.have.value');
  });

  it('should display validation messages if the form is invalid', () => {
    interceptCreateBranchFailedRequest();
    cy.visit(ROUTES.branches.path);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();

    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    verifyFormValidationMessages(Module.branchManagement, SubModule.branchDetails, [
      { field: 'form-field-name-validation', message: 'Branch Name is required' },
      { field: 'form-field-timeZoneId-validation', message: 'TimeZone is required' },
      { field: 'form-field-address.line1-validation', message: 'Address Line 1 is required' },
      { field: 'form-field-address.city-validation', message: 'City is required' },
      { field: 'form-field-address.countryCode-validation', message: 'Country is required' },
      { field: 'form-field-address.subdivision-validation', message: 'State is required' },
      { field: 'form-field-address.postalCode-validation', message: 'Postal Code is required' },
    ]);

    fillBranchDetailsForm(Module.branchManagement, SubModule.branchDetails, {
      name: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long branch name',
      timeZoneId: 'America/Chicago',
      address: {
        line1: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long address line 1',
        line2: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long address line 2',
        city: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long city',
        subdivision: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long state',
        postalCode: 'long postal code',
        countryCode: 'US',
      },
    });
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    verifyFormValidationMessages(Module.branchManagement, SubModule.branchDetails, [
      { field: 'form-field-name-validation', message: 'The Branch Name must not exceed 50 characters.' },
      { field: 'form-field-address.line1-validation', message: 'Address Line 1 must not exceed 50 characters.' },
      { field: 'form-field-address.line2-validation', message: 'Address Line 2 must not exceed 50 characters.' },
      { field: 'form-field-address.city-validation', message: 'City must not exceed 50 characters.' },
      { field: 'form-field-address.subdivision-validation', message: 'State must not exceed 50 characters.' },
    ]);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.postalCode').find('input').clear();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.postalCode').find('input').type('12');

    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    clickField(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress');
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    verifyNotExist(Module.branchManagement, SubModule.branchDetails, [
      'form-field-address.line1-validation',
      'form-field-address.line2-validation',
      'form-field-address.city-validation',
      'form-field-address.subdivision-validation',
      'form-field-address.postalCode-validation',
    ]);
  });

  it('should not be able to create new branch if the form is invalid or branch creation failed', () => {
    interceptCreateBranchFailedRequest();
    cy.visit(ROUTES.branches.path);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-title').should('have.text', 'Create Branch');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type('New Test Branch');
    selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/Chicago');
    clickField(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress');
    clickActionButton(Module.branchManagement, SubModule.branchDetails);
    cy.wait('@createBranchFailedRequest');

    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to create a Branch');
    cy.url().should('include', ROUTES.newBranch.path);
  });

  it('should be able to create new branch and be navigated back to the branch catalog page if the form is valid and branch creation succeeded', () => {
    interceptCreateBranchRequest();
    cy.visit(ROUTES.branches.path);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-row', true).should('have.length', 1);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();

    fillBranchDetailsForm(Module.branchManagement, SubModule.branchDetails, {
      name: 'New York Branch',
      timeZoneId: 'America/New_York',
      address: {
        line1: '270 W 11th Street',
        line2: 'Apt 2E',
        city: 'New York',
        subdivision: 'NY',
        postalCode: '10014',
        countryCode: 'US',
      },
    });
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-submit-button').should('contain.text', 'Save');
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
    );
    cy.wait('@createBranchRequest');
    cy.wait('@fetchMultipleBranchesRequest');

    cy.url().should('include', ROUTES.branches.path);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-row', true).should('have.length', 2);
    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
      .should('exist')
      .and('contain.text', 'Branch has been successfully created');
  });

  it('should display not found page if the branch was not found', () => {
    interceptFetchBranchByIdFailedRequest('222222222224');
    cy.visit(`${ROUTES.branches.path}/edit/222222222224`);

    getTestSelectorByModule(Module.shared, SubModule.notFound, 'page-title').should('exist').and('contain.text', 'Page Not Found');
    getTestSelectorByModule(Module.shared, SubModule.notFound, 'navigate-home-button').should('exist').click();
    cy.location('pathname').should('eq', ROUTES.flows.path);
  });

  it('should reset the form and be navigated back to the branch catalog page if the cancel button is clicked', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(ROUTES.branches.path);

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    cy.wait('@fetchBranchByIdRequest');

    clearBranchDetailsForm(Module.branchManagement, SubModule.branchDetails);
    fillBranchDetailsForm(Module.branchManagement, SubModule.branchDetails, {
      name: 'Hawaii Branch',
      timeZoneId: 'Pacific/Honolulu',
      address: {
        line1: '3211 Dewert Ln',
        line2: '',
        city: 'Honolulu',
        subdivision: 'HI',
        postalCode: '96818',
        countryCode: 'US',
      },
    });
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-cancel-button').should('exist').click();

    cy.url().should('include', ROUTES.branches.path);
    getLinearLoader(Module.branchManagement, SubModule.branchCatalog, 'table').should('not.exist');

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    cy.wait('@fetchBranchByIdRequest');

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-name': 'New York Branch',
      'form-field-timeZoneId': 'America/New_York',
      'form-field-address.line1': '270 W 11th Street',
      'form-field-address.line2': 'Apt 2E',
      'form-field-address.city': 'New York',
      'form-field-address.subdivision': 'NY',
      'form-field-address.postalCode': '10014',
      'form-field-address.countryCode': 'US',
    });
  });

  it('should not be able to edit the branch if the form is invalid or branch update failed', () => {
    interceptEditBranchFailedRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(ROUTES.branches.path);

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-title').should('have.text', 'Edit Branch');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name')
      .find('input')
      .should('have.value', 'New York Branch');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').clear();
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'Branch Name is required');

    clearBranchDetailsForm(Module.branchManagement, SubModule.branchDetails);
    fillBranchDetailsForm(Module.branchManagement, SubModule.branchDetails, {
      name: 'Hawaii Branch',
      timeZoneId: 'Pacific/Honolulu',
      address: {
        line1: '3211 Dewert Ln',
        line2: '',
        city: 'Honolulu',
        subdivision: 'HI',
        postalCode: '96818',
        countryCode: 'US',
      },
    });
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    cy.wait('@editBranchFailedRequest');

    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to update the Branch');
    cy.url().should('include', `${ROUTES.branches.path}/edit/222222222222`);
  });

  it('should display async validation messages if the branch update failed with validation errors', () => {
    interceptEditBranchFailedWithErrorRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(ROUTES.branches.path);

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.postalCode').find('input').clear();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.postalCode').type('*****');
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to update the Branch');
    verifyFormValidationMessages(Module.branchManagement, SubModule.branchDetails, [
      {
        field: 'form-field-address.postalCode-validation',
        message: `Postal Code '*****' for Country 'US - [United States]' is invalid.`,
      },
    ]);
    cy.url().should('include', `${ROUTES.branches.path}/edit/222222222222`);
  });

  it('should display async general validation messages if the branch creation failed with validation errors', () => {
    interceptCreateBranchFailedWithErrorRequest('createBranchFailedWithErrorRequest', 'branch/branch-error-general-create');
    cy.visit(ROUTES.newBranch.path);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type('New Test Branch');
    selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', 'America/Chicago');
    clickField(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress');
    clickActionButton(Module.branchManagement, SubModule.branchDetails);
    cy.wait('@createBranchFailedWithErrorRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-general-error-message')
      .should('exist')
      .and(
        'contain.text',
        'E43705652: The current company license entitlements limit the number of branches that can be created, and this limit has been reached'
      );
    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error').should('exist').and('contain.text', 'Failed to create a Branch');
  });

  it('should be able to edit the branch and be navigated back to the branch catalog page if the form is valid and branch update succeeded', () => {
    interceptEditBranchRequest('222222222222');
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(ROUTES.branches.path);

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('exist');
    verifyTextFields(Module.branchManagement, SubModule.branchDetails, {
      'form-header': 'Branch Details',
      'form-section-field-basicInfo': 'Basic Information',
      'form-section-field-address': 'Address Information',
    });

    cy.wait('@fetchBranchByIdRequest');

    clearBranchDetailsForm(Module.branchManagement, SubModule.branchDetails);
    fillBranchDetailsForm(Module.branchManagement, SubModule.branchDetails, {
      name: 'Anchorage Branch',
      timeZoneId: 'America/Anchorage',
      address: {
        line1: '3801 Centerpoint Dr #200',
        line2: '',
        city: 'Anchorage',
        subdivision: 'AK',
        postalCode: '99503',
        countryCode: 'US',
      },
    });
    clickActionButton(Module.branchManagement, SubModule.branchDetails);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-submit-button').should('have.attr', 'disabled');
    getLoadingButtonLoadingIcon(Module.branchManagement, SubModule.branchDetails, 'form-submit-button').should('be.visible');

    cy.wait('@editBranchRequest');
    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchMultipleUpdatedBranchesRequest', fixture: 'branch/branches-multiple-updated' }
    );

    cy.url().should('include', ROUTES.branches.path);
    getLinearLoader(Module.branchManagement, SubModule.branchCatalog, 'table').should('exist');

    cy.wait('@fetchMultipleUpdatedBranchesRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-row', true).should('have.length', 2);
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-cell-222222222223-name')
      .should('exist')
      .and('have.text', 'Anchorage Branch');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-cell-222222222223-timeZoneName')
      .should('exist')
      .and('have.text', 'Alaskan Standard Time');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-body-cell-222222222223-fullAddress')
      .should('exist')
      .and('have.text', '3801 Centerpoint Dr #200, Anchorage, AK 99503, United States');
    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
      .should('exist')
      .and('contain.text', 'Branch has been successfully updated');
  });

  it('should be able to navigate back when the back button is clicked', () => {
    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches' }
    );
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(ROUTES.branches.path);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-title-back-button').click();

    cy.url().should('include', ROUTES.branches.path);

    cy.visit(ROUTES.branches.path);
    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-title-back-button').click();

    cy.url().should('include', ROUTES.branches.path);
    getLinearLoader(Module.branchManagement, SubModule.branchCatalog, 'table').should('not.exist');
  });

  it('should reset the branch after editing and navigating back', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(ROUTES.branches.path);

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    cy.wait('@fetchBranchByIdRequest');

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-name': 'New York Branch',
      'form-field-timeZoneId': 'America/New_York',
      'form-field-address.line1': '270 W 11th Street',
      'form-field-address.line2': 'Apt 2E',
      'form-field-address.city': 'New York',
      'form-field-address.subdivision': 'NY',
      'form-field-address.postalCode': '10014',
      'form-field-address.countryCode': 'US',
    });

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'page-title-back-button').click();
    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();

    cy.url().should('include', ROUTES.newBranch.path);
    // TODO: flaky part
    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-name': '',
      'form-field-timeZoneId': '',
      'form-field-address.line1': '',
      'form-field-address.line2': '',
      'form-field-address.city': '',
      'form-field-address.subdivision': '',
      'form-field-address.postalCode': '',
      'form-field-address.countryCode': '',
    });
  });

  it('should reset the form when navigating between different branches', () => {
    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
    );
    interceptFetchBranchByIdRequest('222222222222', 'fetchFirstBranchByIdRequest', 'branch/branches-multiple');
    interceptFetchBranchByIdRequest('222222222223', 'fetchSecondBranchByIdRequest', 'branch/branches-multiple');
    cy.visit(ROUTES.branches.path);

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222222');

    cy.wait('@fetchFirstBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-cancel-button').click();

    selectAction(Module.branchManagement, SubModule.branchCatalog, 'edit', '222222222223');

    cy.wait('@fetchSecondBranchByIdRequest');

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-name': 'Hawaii Branch',
      'form-field-timeZoneId': 'Pacific/Honolulu',
      'form-field-address.line1': '3211 Dewert Ln',
      'form-field-address.line2': '',
      'form-field-address.city': 'Honolulu',
      'form-field-address.subdivision': 'HI',
      'form-field-address.postalCode': '96818',
      'form-field-address.countryCode': 'US',
    });
  });

  it('should reset the form when navigating to an employee page and back to the branch creation page', () => {
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptFetchBranchByIdRequest('222222222222');
    interceptFetchBranchesByIdsRequest({ ids: [222222222222] });
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchBranchesRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
    );
    cy.visit(ROUTES.employees.path);

    cy.wait('@fetchMultipleEmployeesRequest');

    selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333335');
    cy.wait('@fetchEmployeeByIdRequest');

    getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'page-title-back-button').click();
    selectNavigationMenuItem('Branches');

    cy.url().should('include', ROUTES.branches.path);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchCatalog, 'table-layout-action-button').click();

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-name': '',
      'form-field-timeZoneId': '',
      'form-field-address.line1': '',
      'form-field-address.line2': '',
      'form-field-address.city': '',
      'form-field-address.subdivision': '',
      'form-field-address.postalCode': '',
      'form-field-address.countryCode': '',
    });
  });

  it('should fetch and display the branch form details by id when refreshing the page', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(`${ROUTES.branches.path}/edit/222222222222`);

    cy.reload();

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('exist');
    cy.wait('@fetchBranchByIdRequest');

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-name': 'New York Branch',
      'form-field-timeZoneId': 'America/New_York',
      'form-field-address.line1': '270 W 11th Street',
      'form-field-address.line2': 'Apt 2E',
      'form-field-address.city': 'New York',
      'form-field-address.subdivision': 'NY',
      'form-field-address.postalCode': '10014',
      'form-field-address.countryCode': 'US',
    });
  });

  it('should not display the loader if the request resolves quickly', () => {
    interceptFetchBranchByIdRequest('222222222222', 'fetchBranchByIdQuickRequest', 'branch/branches', 200, 50);
    cy.visit(`${ROUTES.branches.path}/edit/222222222222`);

    getLinearLoader(Module.branchManagement, SubModule.branchDetails, 'form').should('not.exist');
    cy.wait('@fetchBranchByIdQuickRequest');
  });

  it('should display 2 countries if the company country is different than the branch address country', () => {
    interceptFetchBranchByIdRequest('222222222224', 'fetchBranchByIdRequest', 'branch/branches-multiple-different-countries');
    cy.visit(`${ROUTES.branches.path}/edit/222222222224`);

    cy.wait('@fetchBranchByIdRequest');

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-address.countryCode': 'PL',
    });

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.countryCode').click();

    verifyOptions(Module.branchManagement, SubModule.branchDetails, 'form-field-address.countryCode-option', ['PL', 'US']);
  });

  it('should display only available timezones for selected company country', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(`${ROUTES.branches.path}/edit/222222222222`);

    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-timeZoneId').click();

    verifyOptions(Module.branchManagement, SubModule.branchDetails, 'form-field-timeZoneId-option', [
      'Pacific/Honolulu',
      'America/Anchorage',
      'America/New_York',
      'America/Chicago',
    ]);
  });

  it('should display company timezones and the branch timezone if the company timezone is different than the branch address timezone', () => {
    interceptFetchBranchByIdRequest('222222222224', 'fetchBranchByIdRequest', 'branch/branches-multiple-different-countries');
    cy.visit(`${ROUTES.branches.path}/edit/222222222224`);

    cy.wait('@fetchBranchByIdRequest');

    verifyInputFields(Module.branchManagement, SubModule.branchDetails, {
      'form-field-timeZoneId': 'Europe/Warsaw',
    });

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-timeZoneId').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-timeZoneId-option-Europe/Warsaw')
      .should('exist')
      .and('have.text', 'Central European Standard Time');
    verifyOptions(Module.branchManagement, SubModule.branchDetails, 'form-field-timeZoneId-option', [
      'Europe/Warsaw',
      'Pacific/Honolulu',
      'America/Anchorage',
      'America/New_York',
      'America/Chicago',
    ]);
  });

  it('should show and hide address fields correctly', () => {
    interceptFetchBranchByIdRequest('222222222222');
    cy.visit(`${ROUTES.branches.path}/edit/222222222222`);

    cy.wait('@fetchBranchByIdRequest');

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress').should(
      'not.have.class',
      'Mui-checked'
    );
    verifyBranchDetailsFormFieldsExist([
      'form-field-name',
      'form-field-timeZoneId',
      'form-field-address.line1',
      'form-field-address.line2',
      'form-field-address.city',
      'form-field-address.subdivision',
      'form-field-address.postalCode',
      'form-field-address.countryCode',
    ]);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress').click();

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress').should(
      'have.class',
      'Mui-checked'
    );
    verifyBranchDetailsFormFieldsExist(['form-field-name', 'form-field-timeZoneId']);
    verifyBranchDetailsFormFieldsNotExist([
      'form-field-address.line1',
      'form-field-address.line2',
      'form-field-address.city',
      'form-field-address.subdivision',
      'form-field-address.postalCode',
      'form-field-address.countryCode',
    ]);

    interceptFetchBranchByIdRequest('222222222225', 'fetchBranchByIdRequest', 'branch/branches-multiple-different-countries');
    cy.visit(`${ROUTES.branches.path}/edit/222222222225`);

    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-noPhysicalAddress').should(
      'have.class',
      'Mui-checked'
    );
    verifyBranchDetailsFormFieldsExist(['form-field-name', 'form-field-timeZoneId']);
    verifyBranchDetailsFormFieldsNotExist([
      'form-field-address.line1',
      'form-field-address.line2',
      'form-field-address.city',
      'form-field-address.subdivision',
      'form-field-address.postalCode',
      'form-field-address.countryCode',
    ]);
  });
});
