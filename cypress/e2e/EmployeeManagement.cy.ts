import { Module, SubModule } from '../../src/shared/models';
import {
  getLinearLoader,
  getTestSelectorByModule,
  selectAction,
  // selectOption,
  // verifyInputFields,
  verifyTextFields,
} from '../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchEmployeeRequest,
  interceptFetchEmployeesRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const testEmployeeFields = () => {
  verifyTextFields(Module.employeeManagement, SubModule.employeeViewDetails, {
    'view-details-header': 'Employee Details',
    'view-details-section-basicInfo': 'Basic Information',
    'view-details-label-firstName': 'Employee First Name',
    'view-details-value-firstName': 'Anthony',
    'view-details-label-lastName': 'Employee Last Name',
    'view-details-value-lastName': 'Crowley',
    'view-details-label-fullName': 'Employee Full Name',
    'view-details-value-fullName': 'Anthony User Crowley',
    'view-details-label-assignedBranchName': 'Employee Assigned Branch',
    'view-details-value-assignedBranchName': 'New York Branch',
  });
};

describe('Employee Management Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 5 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employees-multiple' }
    );
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
    });

    it('should be able to navigate and view the employee page', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      cy.visit('/manage/employees');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'action-view-333333333335');

      cy.url().should('include', '/manage/employees/view/333333333335');
      getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');

      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 100 });
      cy.wait('@fetchEmployeeByIdRequest');

      testEmployeeFields();
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-action-button').should('not.exist');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should be able to navigate and view the employee page', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      cy.visit('/manage/employees');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'action-view-333333333335');

      cy.url().should('include', '/manage/employees/view/333333333335');
      getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');

      interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 100 });
      cy.wait('@fetchEmployeeByIdRequest');

      testEmployeeFields();
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-action-button').should('exist');
    });

    it('should be able to navigate back when the back button is clicked', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      cy.visit('/manage/employees');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-body-cell-333333333335-firstName')
        .find('p')
        .click();

      cy.url().should('include', '/manage/employees/view/333333333335');

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
      );

      cy.get('[data-cy="page-title-back-button"]').click();

      cy.url().should('include', '/manage/employees');

      selectAction(Module.employeeManagement, SubModule.employeeTable, 'action-edit-333333333335');
      cy.get('[data-cy="page-title-back-button"]').click();

      cy.url().should('include', '/manage/employees');
    });

    // it('should reset the form and navigate to employee table page if the cancel button is clicked', () => {
    //   interceptFetchEmployeeByIdRequest('333333333335', 'fetchEmployeeByIdRequest', 'employees-multiple');
    //   cy.visit('/manage/employees');

    //   selectAction(Module.employeeManagement, SubModule.employeeTable, 'action-edit-333333333335');

    //   cy.url().should('include', '/manage/employees/edit/333333333335');

    //   interceptFetchBranchesRequest(
    //     { pageNumber: 1, pageSize: 100 },
    //     { alias: 'fetchMultipleBranchesRequest', fixture: 'branches-multiple' }
    //   );

    //   cy.wait('@fetchEmployeeByIdRequest');

    //   // TODO: check if the labelValue fields exist and have correct labels and values, after the new field type is implemented
    //   verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
    //     'form-field-assignedBranchId': 'New York Branch',
    //   });

    //   selectOption(Module.employeeManagement, SubModule.employeeDetails, 'assignedBranchId', '222222222223');
    //   getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-cancel-button').should('exist').click();

    //   cy.url().should('include', '/manage/employees');

    //   selectAction(Module.employeeManagement, SubModule.employeeTable, 'action-edit-333333333335');

    //   verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
    //     'form-field-assignedBranchId': 'New York Branch',
    //   });
    // });

    // TODO: add test cases when navigating between different employees, check if the employee is being reset correctly
  });
});
