import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  getLinearLoader,
  getLoadingButtonLoadingIcon,
  getTestSelectorByModule,
  verifyInputFields,
  verifyFormValidationMessages,
  clickActionButton,
  verifyNotExist,
  verifyTextFields,
  selectAction,
  fillDepartmentDetailsForm,
  clearDepartmentDetailsForm,
} from 'support/helpers';
import {
  interceptCreateDepartmentFailedRequest,
  interceptCreateDepartmentFailedWithErrorRequest,
  interceptCreateDepartmentRequest,
  interceptEditDepartmentFailedRequest,
  interceptEditDepartmentFailedWithErrorRequest,
  interceptEditDepartmentRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchDepartmentByIdFailedRequest,
  interceptFetchDepartmentByIdRequest,
  interceptFetchDepartmentsByIdsRequest,
  interceptFetchDepartmentsRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchEmployeesByIdsRequest,
  interceptFetchEmployeesRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from 'support/interceptors';

const testDepartmentEmptyInputFields = () => {
  verifyInputFields(Module.departmentManagement, SubModule.departmentDetails, {
    'form-field-name': '',
    'form-field-parentDepartmentId': '',
    'form-field-managerId': '',
  });
};

const testDepartmentInputFields = () => {
  verifyInputFields(Module.departmentManagement, SubModule.departmentDetails, {
    'form-field-name': 'Line Production',
    'form-field-parentDepartmentId': 'Production',
    'form-field-managerId': 'Anthony User Crowley',
  });
};

describe('Department Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
    interceptFetchProfileRequest();
    cy.loginMock(true);
  });

  it('should display an empty form on department creation page', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    cy.visit(ROUTES.newDepartment.path);

    testDepartmentEmptyInputFields();

    cy.visit(ROUTES.departments.path);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

    testDepartmentEmptyInputFields();
  });

  it('should display validation messages if the form is invalid', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptCreateDepartmentFailedRequest();
    cy.visit(ROUTES.departments.path);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    verifyFormValidationMessages(Module.departmentManagement, SubModule.departmentDetails, [
      { field: 'form-field-name-validation', message: 'Department Name is required' },
      { field: 'form-field-managerId-validation', message: 'Manager is required' },
    ]);

    fillDepartmentDetailsForm({
      name: 'Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery long department name',
      parentDepartmentId: 444444444446,
      managerId: 333333333335,
    });
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    verifyFormValidationMessages(Module.departmentManagement, SubModule.departmentDetails, [
      { field: 'form-field-name-validation', message: 'The Department Name must not exceed 50 characters.' },
    ]);

    clearDepartmentDetailsForm();
    fillDepartmentDetailsForm({
      name: 'Valid Name',
    });
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    verifyNotExist(Module.departmentManagement, SubModule.departmentDetails, [
      'form-field-name-validation',
      'form-field-parentDepartmentId-validation',
      'form-field-managerId-validation',
    ]);
  });

  it('should not be able to create a new department if department creation failed', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptCreateDepartmentFailedRequest();
    cy.visit(ROUTES.departments.path);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'page-title').should(
      'have.text',
      'Create Department'
    );

    fillDepartmentDetailsForm({
      name: 'New Department',
      parentDepartmentId: 444444444446,
      managerId: 333333333335,
    });
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);
    cy.wait('@createDepartmentFailedRequest');

    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
      .should('exist')
      .and('contain.text', 'Failed to create a Department');
    cy.url().should('include', ROUTES.newDepartment.path);
  });

  it('should be able to create a new department and be navigated back to the Department Catalog page if the form is valid and the department creation succeeded', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptCreateDepartmentRequest();
    cy.visit(ROUTES.departments.path);

    cy.wait('@fetchDepartmentsRequest');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

    fillDepartmentDetailsForm({
      name: 'Set Design',
      parentDepartmentId: 444444444446,
      managerId: 333333333333,
    });
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-submit-button').should('contain.text', 'Save');
    interceptFetchDepartmentsRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchCreatedDepartmentsRequest', fixture: 'department/departments-created' }
    );
    interceptFetchDepartmentsByIdsRequest();
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    cy.wait('@createDepartmentRequest');
    cy.wait('@fetchCreatedDepartmentsRequest');

    cy.url().should('include', ROUTES.departments.path);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 5);
    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
      .should('exist')
      .and('contain.text', 'Department has been successfully created');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444448-name').should(
      'have.text',
      'Set Design'
    );

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId').click();

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option', true).should(
      'have.length',
      5
    );
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option-444444444448')
      .should('exist')
      .and('have.text', 'Set Design');
  });

  it('should display Not Found page if the department was not found', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentByIdFailedRequest('444444444443');
    interceptFetchEmployeeByIdRequest('333333333333');
    cy.visit(`${ROUTES.departments.path}/edit/444444444443`);

    getTestSelectorByModule(Module.shared, SubModule.notFound, 'page-title').should('exist').and('contain.text', 'Page Not Found');
    getTestSelectorByModule(Module.shared, SubModule.notFound, 'navigate-home-button').should('exist').click();
    cy.location('pathname').should('eq', ROUTES.flows.path);
  });

  it('should reset the form and be navigated back to the Department Catalog page if the cancel button is clicked', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    cy.visit(ROUTES.departments.path);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444444');

    cy.wait('@fetchDepartmentByIdRequest');

    clearDepartmentDetailsForm();
    fillDepartmentDetailsForm({
      name: 'Department Name',
      parentDepartmentId: 444444444446,
      managerId: 333333333335,
    });
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-cancel-button').should('exist').click();

    cy.url().should('include', ROUTES.departments.path);
    getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444444');

    cy.wait('@fetchDepartmentByIdRequest');

    verifyInputFields(Module.departmentManagement, SubModule.departmentDetails, {
      'form-field-name': 'Production',
      'form-field-parentDepartmentId': '',
      'form-field-managerId': 'Anthony User Crowley',
    });
  });

  it('should not be able to edit the department if the form is invalid or department updating failed', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentByIdRequest('444444444447');
    interceptFetchEmployeeByIdRequest('333333333333');
    interceptEditDepartmentFailedRequest('444444444447');
    cy.visit(ROUTES.departments.path);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444447');

    cy.wait('@fetchDepartmentByIdRequest');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'page-title').should('have.text', 'Edit Department');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-name')
      .find('input')
      .should('have.value', 'Costume');

    clearDepartmentDetailsForm();
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-name-validation')
      .should('exist')
      .and('have.text', 'Department Name is required');

    clearDepartmentDetailsForm();
    fillDepartmentDetailsForm({
      name: 'Set Design',
      managerId: 333333333333,
    });
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    cy.wait('@editDepartmentFailedRequest');

    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
      .should('exist')
      .and('contain.text', 'Failed to update the Department');
    cy.url().should('include', `${ROUTES.departments.path}/edit/444444444447`);
  });

  it('should display async validation messages if the department update failed with validation errors', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentByIdRequest('444444444446');
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptFetchEmployeeByIdRequest('333333333334');
    interceptEditDepartmentFailedWithErrorRequest('444444444446');
    cy.visit(ROUTES.departments.path);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444446');

    cy.wait('@fetchDepartmentByIdRequest');

    fillDepartmentDetailsForm({
      parentDepartmentId: 444444444446,
    });
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
      .should('exist')
      .and('contain.text', 'Failed to update the Department');
    verifyFormValidationMessages(Module.departmentManagement, SubModule.departmentDetails, [
      {
        field: 'form-field-parentDepartmentId-validation',
        message: 'Parent department must be in the same tenant and cannot be self-referential',
      },
    ]);
    cy.url().should('include', `${ROUTES.departments.path}/edit/444444444446`);
  });

  it('should display async general validation messages if the department creation failed with validation errors', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptCreateDepartmentFailedWithErrorRequest();
    cy.visit(ROUTES.newDepartment.path);

    fillDepartmentDetailsForm({
      name: 'Department Name',
      parentDepartmentId: 444444444446,
      managerId: 333333333335,
    });
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);
    cy.wait('@createDepartmentFailedWithErrorRequest');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-general-error-message')
      .should('exist')
      .and(
        'contain.text',
        'E43705653: The current company license entitlements limit the number of departments that can be created, and this limit has been reached'
      );
    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
      .should('exist')
      .and('contain.text', 'Failed to create a Department');
  });

  it('should be able to edit the department and be navigated back to the Department Catalog page if the form is valid and department updating succeeded', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentByIdRequest('444444444447');
    interceptFetchEmployeeByIdRequest('333333333333');
    interceptEditDepartmentRequest('444444444447');
    cy.visit(ROUTES.departments.path);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444447-name')
      .should('exist')
      .and('have.text', 'Costume');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444447-parentDepartmentName')
      .should('exist')
      .and('have.text', '-');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444447-managerName')
      .should('exist')
      .and('have.text', 'Gabriel Admin Archangel');
    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444447');

    getLinearLoader(Module.departmentManagement, SubModule.departmentDetails, 'form').should('exist');
    verifyTextFields(Module.departmentManagement, SubModule.departmentDetails, {
      'form-header': 'Department Details',
      'form-section-field-basicInfo': 'Basic Information',
    });

    cy.wait('@fetchDepartmentByIdRequest');

    clearDepartmentDetailsForm();
    fillDepartmentDetailsForm({
      name: 'Costume Updated',
      parentDepartmentId: 444444444446,
      managerId: 333333333335,
    });
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentsRequest(
      { pageNumber: 1, pageSize: 10, search: '' },
      { alias: 'fetchUpdatedDepartmentsRequest', fixture: 'department/departments-updated' }
    );
    clickActionButton(Module.departmentManagement, SubModule.departmentDetails);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-submit-button').should('have.attr', 'disabled');
    getLoadingButtonLoadingIcon(Module.departmentManagement, SubModule.departmentDetails, 'form-submit-button').should('be.visible');

    cy.wait('@editDepartmentRequest');

    cy.url().should('include', ROUTES.departments.path);
    getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('exist');

    cy.wait('@fetchUpdatedDepartmentsRequest');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-row', true).should('have.length', 4);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444447-name')
      .should('exist')
      .and('have.text', 'Costume Updated');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444447-parentDepartmentName')
      .should('exist')
      .and('have.text', 'Unit Production');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-body-cell-444444444447-managerName')
      .should('exist')
      .and('have.text', 'Anthony User Crowley');
    getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
      .should('exist')
      .and('contain.text', 'Department has been successfully updated');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId').click();

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option', true).should(
      'have.length',
      4
    );
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option-444444444447')
      .should('exist')
      .and('have.text', 'Costume Updated');
  });

  it('should be able to navigate back when the back button is clicked', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    cy.visit(ROUTES.departments.path);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'page-title-back-button').click();

    cy.url().should('include', ROUTES.departments.path);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444444');
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'page-title-back-button').click();

    cy.url().should('include', ROUTES.departments.path);
    getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
  });

  // TODO: flaky test
  it('should reset the department after editing and navigating back', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentByIdRequest('444444444447');
    interceptFetchEmployeeByIdRequest('333333333333');
    cy.visit(ROUTES.departments.path);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444447');

    cy.wait('@fetchDepartmentByIdRequest');

    verifyInputFields(Module.departmentManagement, SubModule.departmentDetails, {
      'form-field-name': 'Costume',
      'form-field-parentDepartmentId': '',
      'form-field-managerId': 'Gabriel Admin Archangel',
    });

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'page-title-back-button').click();
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

    cy.url().should('include', ROUTES.newDepartment.path);
    testDepartmentEmptyInputFields();
  });

  it('should reset the form when navigating between different departments', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchDepartmentByIdRequest('444444444446', 'fetchFirstDepartmentByIdRequest');
    interceptFetchDepartmentByIdRequest('444444444447', 'fetchSecondDepartmentByIdRequest');
    interceptFetchEmployeeByIdRequest('333333333333');
    interceptFetchEmployeeByIdRequest('333333333334');
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptEditDepartmentRequest('444444444447');
    cy.visit(ROUTES.departments.path);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444446');

    cy.wait('@fetchFirstDepartmentByIdRequest');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-cancel-button').click();

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444447');

    cy.wait('@fetchSecondDepartmentByIdRequest');

    verifyInputFields(Module.departmentManagement, SubModule.departmentDetails, {
      'form-field-name': 'Costume',
      'form-field-parentDepartmentId': '',
      'form-field-managerId': 'Gabriel Admin Archangel',
    });
  });

  it('should fetch and display the department form details by id when refreshing the page', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
    );
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchDepartmentByIdRequest('444444444445');
    interceptFetchEmployeeByIdRequest('333333333335');
    cy.visit(`${ROUTES.departments.path}/edit/444444444445`);

    cy.wait('@fetchDepartmentByIdRequest');

    testDepartmentInputFields();
    cy.reload();

    getLinearLoader(Module.departmentManagement, SubModule.departmentDetails, 'form').should('exist');
    cy.wait('@fetchDepartmentByIdRequest');

    testDepartmentInputFields();
  });

  it('should not display the loader if the request resolves quickly', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentByIdRequest('444444444444', 'fetchDepartmentByIdQuickRequest', 'department/departments', 200, 50);
    cy.visit(`${ROUTES.departments.path}/edit/444444444444`);

    getLinearLoader(Module.departmentManagement, SubModule.departmentDetails, 'form').should('not.exist');
    cy.wait('@fetchDepartmentByIdQuickRequest');
  });

  it('should fetch and display the parent departments when scrolling down the parent department field', () => {
    interceptFetchEmployeesRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchEmployeeByIdRequest('333333333335');
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    cy.visit(`${ROUTES.departments.path}/edit/444444444444`);
    interceptFetchDepartmentsRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchParentDepartmentsRequestPage1', fixture: 'department/departments-multiple-page-one' }
    );
    cy.visit(`${ROUTES.departments.path}/edit/444444444444`);

    cy.wait('@fetchDepartmentByIdRequest');
    cy.wait('@fetchParentDepartmentsRequestPage1').its('request.url').should('include', 'Departments?pageNumber=1&pageSize=10');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId').click();

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option', true).should(
      'have.length',
      10
    );

    interceptFetchDepartmentsRequest(
      { pageNumber: 2, pageSize: 10 },
      { alias: 'fetchParentDepartmentsRequestPage2', fixture: 'department/departments-multiple-page-two' }
    );

    cy.get('[role="list-box"]').should('exist');
    cy.get('[role="list-box"]').then(($listbox) => {
      $listbox[0].scrollTop = $listbox[0].scrollHeight;
      $listbox[0].dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    cy.wait('@fetchParentDepartmentsRequestPage2').its('request.url').should('include', 'Departments?pageNumber=2&pageSize=10');

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option', true).should(
      'have.length',
      12
    );

    cy.intercept('GET', '**/Departments?pageNumber=3&pageSize=10').as('fetchParentDepartmentsRequestPage3');

    cy.get('[role="list-box"]').then(($listbox) => {
      $listbox[0].scrollTop = $listbox[0].scrollHeight;
      $listbox[0].dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    cy.get('@fetchParentDepartmentsRequestPage3.all').should('have.length', 0);
  });

  it('should display the parent department even if it is not in the first page of the parent departments field', () => {
    interceptFetchEmployeesRequest({}, { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' });
    interceptFetchEmployeeByIdRequest('333333333333');
    interceptFetchDepartmentByIdRequest('444444444453', 'fetchDepartmentByIdRequest', 'department/departments-multiple-page-one');
    interceptFetchDepartmentByIdRequest('444444444455', 'fetchParentDepartmentByIdRequest', 'department/departments-multiple-page-two');
    interceptFetchDepartmentsRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchParentDepartmentsRequestPage1', fixture: 'department/departments-multiple-page-one' }
    );
    cy.visit(`${ROUTES.departments.path}/edit/444444444453`);

    cy.wait(['@fetchDepartmentByIdRequest', '@fetchParentDepartmentsRequestPage1']);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId').click();

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option', true).should(
      'have.length',
      11
    );
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-parentDepartmentId-option-444444444455')
      .should('exist')
      .and('have.text', 'Visual Effects');
  });

  it('should correctly navigate between the Department Catalog and Department Management pages', () => {
    interceptFetchDepartmentsRequest();
    interceptFetchEmployeesByIdsRequest();
    interceptFetchDepartmentsByIdsRequest();
    interceptFetchEmployeesRequest();
    interceptFetchDepartmentByIdRequest('444444444444');
    interceptFetchEmployeeByIdRequest('333333333335');
    cy.visit(`${ROUTES.departments.path}`);

    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'edit', '444444444444');

    cy.url().should('include', `${ROUTES.departments.path}/edit/444444444444`);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-cancel-button').click();

    cy.location('pathname').should('eq', ROUTES.departments.path);
    selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'view', '444444444444');

    cy.url().should('include', `${ROUTES.departments.path}/view/444444444444`);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentViewDetails, 'page-title-back-button').click();

    cy.location('pathname').should('eq', ROUTES.departments.path);

    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

    cy.url().should('include', ROUTES.newDepartment.path);
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-cancel-button').click();

    cy.location('pathname').should('eq', ROUTES.departments.path);
  });
});
