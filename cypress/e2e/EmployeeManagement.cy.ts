import { Module, SubModule } from '../../src/shared/models';
import {
  clickActionButton,
  getLinearLoader,
  getTestSelectorByModule,
  selectAction,
  verifyInputFields,
  verifyTextFields,
} from '../support/helpers';
import {
  interceptEditEmployeeFailedRequest,
  interceptEditEmployeeRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchProfileRequest,
  interceptFetchEmployeesRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesByIdsRequest,
} from '../support/interceptors';

const testEmployeeViewFields = () => {
  verifyTextFields(Module.employeeManagement, SubModule.employeeViewDetails, {
    'view-details-header': 'Employee Details',
    'view-details-section-basicInfo': 'Basic Information',
    'view-details-label-firstName': 'First Name',
    'view-details-value-firstName': 'Anthony',
    'view-details-label-lastName': 'Last Name',
    'view-details-value-lastName': 'Crowley',
    'view-details-label-fullName': 'Full Name',
    'view-details-value-fullName': 'Anthony User Crowley',
    'view-details-section-branchInfo': 'Branch Information',
    'view-details-label-assignedBranchName': 'Assigned Branch',
    'view-details-value-assignedBranchName': 'New York Branch',
  });
};

const testEmployeeFormFields = () => {
  verifyTextFields(Module.employeeManagement, SubModule.employeeDetails, {
    'form-field-label-firstName': 'First Name',
    'form-field-value-firstName': 'Anthony',
    'form-field-label-lastName': 'Last Name',
    'form-field-value-lastName': 'Crowley',
    'form-field-label-fullName': 'Full Name',
    'form-field-value-fullName': 'Anthony User Crowley',
  });
  verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
    'form-field-assignedBranchId-input': 'New York Branch',
  });
};

describe('Employee Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchProfileRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
    );
  });

  const roles = [
    { role: 'User', loginMock: () => cy.loginMock(), viewActionButtonExists: false },
    { role: 'Admin', loginMock: () => cy.loginMock(true), viewActionButtonExists: true },
  ];

  roles.forEach(({ role, loginMock, viewActionButtonExists }) => {
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should be able to navigate and view the employee page', () => {
        interceptFetchEmployeeByIdRequest('333333333335');
        interceptFetchBranchByIdRequest('222222222222');
        interceptFetchBranchesByIdsRequest({ ids: [222222222222] });
        cy.visit('/manage/employees');

        selectAction(Module.employeeManagement, SubModule.employeeTable, 'view', '333333333335');

        cy.url().should('include', '/manage/employees/view/333333333335');
        getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');

        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 100 });
        cy.wait('@fetchEmployeeByIdRequest');

        testEmployeeViewFields();
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-action-button').should(
          viewActionButtonExists ? 'exist' : 'not.exist'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-profile-button').should('not.exist');
      });

      it('should render the profile button and be able to navigate to profile page if the employee is the current user', () => {
        interceptFetchEmployeeByIdRequest('333333333333', 'fetchEmployeeByIdRequest', 'employees-multiple');
        interceptFetchBranchByIdRequest('222222222222');
        interceptFetchBranchesByIdsRequest({ ids: [222222222222] });
        cy.visit('/manage/employees');

        selectAction(Module.employeeManagement, SubModule.employeeTable, 'view', '333333333333');

        cy.url().should('include', '/manage/employees/view/333333333333');
        getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');

        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 100 });
        cy.wait('@fetchEmployeeByIdRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-profile-button').should('exist').click();

        cy.url().should('include', '/manage/profile/view');
      });
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should be able to navigate back when the back button is clicked', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesByIdsRequest({ ids: [222222222222] });
      cy.visit('/manage/employees');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-firstName')
        .find('p')
        .click();

      cy.url().should('include', '/manage/employees/view/333333333335');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'page-title-back-button').click();

      cy.url().should('include', '/manage/employees');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'edit', '333333333335');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'page-title-back-button').click();

      cy.url().should('include', '/manage/employees');
    });

    it('should reset the form and navigate to employee table page if the cancel button is clicked', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesByIdsRequest({ ids: [222222222222] });
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100, search: '*' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/employees');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'edit', '333333333335');

      cy.url().should('include', '/manage/employees/edit/333333333335');

      cy.wait('@fetchEmployeeByIdRequest');
      cy.wait('@fetchBranchByIdRequest');

      testEmployeeFormFields();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();
      cy.get('.MuiAutocomplete-clearIndicator').click();
      cy.focused().type('Hawaii');

      cy.wait('@fetchMultipleBranchesRequest');

      getTestSelectorByModule(
        Module.employeeManagement,
        SubModule.employeeDetails,
        'form-field-assignedBranchId-option-222222222223'
      ).click();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', '/manage/employees');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'edit', '333333333335');

      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': 'New York Branch',
      });
    });

    it('should not be able to edit the employee if the employee updating failed', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptEditEmployeeFailedRequest('333333333335');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/employees/edit/333333333335');

      cy.wait('@fetchEmployeeByIdRequest');

      clickActionButton(Module.employeeManagement, SubModule.employeeDetails);

      cy.wait('@editEmployeeFailedRequest');

      cy.get('[data-cy="error-snackbar"]').should('exist').and('contain.text', 'Failed to update the Employee');
    });

    it('should be able to edit the employee and be navigated to employee table page if the employee updating succeeded', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptEditEmployeeRequest('333333333335');
      interceptFetchBranchesByIdsRequest({ ids: [222222222222] });
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100, search: '*' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/employees');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row', true).should('have.length', 3);
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-firstName')
        .find('p')
        .should('exist')
        .and('have.text', 'Anthony');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-lastName')
        .should('exist')
        .and('have.text', 'Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-fullName')
        .should('exist')
        .and('have.text', 'Anthony User Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-assignedBranchName')
        .should('exist')
        .and('have.text', 'New York Branch');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'edit', '333333333335');

      cy.wait('@fetchEmployeeByIdRequest');
      cy.wait('@fetchBranchByIdRequest');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();
      cy.get('.MuiAutocomplete-clearIndicator').click();
      cy.focused().type('Hawaii');

      cy.wait('@fetchMultipleBranchesRequest');

      getTestSelectorByModule(
        Module.employeeManagement,
        SubModule.employeeDetails,
        'form-field-assignedBranchId-option-222222222223'
      ).click();

      clickActionButton(Module.employeeManagement, SubModule.employeeDetails);
      cy.wait('@editEmployeeRequest');

      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchMultipleEmployeesUpdatedRequest', fixture: 'employees-multiple-updated' }
      );
      interceptFetchBranchesByIdsRequest({ ids: [222222222223] }, { alias: 'fetchBranchesByIdsRequest', fixture: 'branches-multiple' });

      cy.url().should('include', '/manage/employees');
      getLinearLoader(Module.employeeManagement, SubModule.employeeTable, 'table').should('exist');

      cy.wait('@fetchMultipleEmployeesUpdatedRequest');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-row', true).should('have.length', 3);
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-firstName')
        .find('p')
        .should('exist')
        .and('have.text', 'Anthony');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-lastName')
        .should('exist')
        .and('have.text', 'Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-fullName')
        .should('exist')
        .and('have.text', 'Anthony User Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-assignedBranchName')
        .should('exist')
        .and('have.text', 'Hawaii Branch');
      cy.get('[data-cy="success-snackbar"]').should('exist').and('contain.text', 'Employee has been successfully updated');
    });

    it('should fetch and display the employee view details by id when refreshing the page', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/employees/view/333333333335');

      cy.reload();

      getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');
      cy.wait('@fetchEmployeeByIdRequest');

      testEmployeeViewFields();
    });

    it('should fetch and display the employee form details by id when refreshing the page', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/employees/edit/333333333335');

      cy.reload();

      getLinearLoader(Module.employeeManagement, SubModule.employeeDetails, 'form').should('exist');
      cy.wait('@fetchEmployeeByIdRequest');

      testEmployeeFormFields();
    });

    it('should search and display correct branches', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptEditEmployeeRequest('333333333335');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100, search: '*' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );
      cy.visit('/manage/employees/edit/333333333335');

      cy.wait('@fetchEmployeeByIdRequest');
      cy.wait('@fetchBranchByIdRequest');

      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': 'New York Branch',
      });

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();
      cy.get('.MuiAutocomplete-clearIndicator').click();

      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': '',
      });

      cy.focused().type('Hawaii');

      cy.wait('@fetchMultipleBranchesRequest');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option', true).should(
        'have.length',
        1
      );

      getTestSelectorByModule(
        Module.employeeManagement,
        SubModule.employeeDetails,
        'form-field-assignedBranchId-option-222222222223'
      ).click();

      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': 'Hawaii Branch',
      });

      cy.get('.MuiAutocomplete-clearIndicator').click();
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option', true).should(
        'have.length',
        2
      );
    });

    // TODO: add test cases when navigating between different employees, check if the employee is being reset correctly
  });
});
