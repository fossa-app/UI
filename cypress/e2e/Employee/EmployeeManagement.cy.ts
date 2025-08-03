import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  clickActionButton,
  getLinearLoader,
  getTestSelectorByModule,
  selectAction,
  verifyFormValidationMessages,
  verifyInputFields,
  verifyTextFields,
} from 'support/helpers';
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
  interceptEditEmployeeFailedWithErrorRequest,
  interceptFetchCompanySettingsRequest,
} from 'support/interceptors';

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
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchBranchesRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchOnboardingBranchesRequest' });
    interceptFetchProfileRequest();
    interceptFetchEmployeesRequest(
      { pageNumber: 1, pageSize: 10 },
      { alias: 'fetchMultipleEmployeesRequest', fixture: 'employee/employees-multiple' }
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

      it('should be able to navigate and view the View Employee page', () => {
        interceptFetchEmployeeByIdRequest('333333333335');
        interceptFetchBranchByIdRequest('222222222222');
        interceptFetchBranchesByIdsRequest();
        cy.visit(ROUTES.employees.path);

        selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'view', '333333333335');

        cy.url().should('include', `${ROUTES.employees.path}/view/333333333335`);
        getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');

        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 100 });
        cy.wait('@fetchEmployeeByIdRequest');

        testEmployeeViewFields();
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-action-button').should(
          viewActionButtonExists ? 'exist' : 'not.exist'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-profile-button').should('not.exist');
      });

      it('should render the profile button and be able to navigate to the Profile page if the employee is the current user', () => {
        interceptFetchEmployeeByIdRequest('333333333333', 'fetchEmployeeByIdRequest', 'employee/employees-multiple');
        interceptFetchBranchByIdRequest('222222222222');
        interceptFetchBranchesByIdsRequest();
        cy.visit(ROUTES.employees.path);

        selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'view', '333333333333');

        cy.url().should('include', `${ROUTES.employees.path}/view/333333333333`);
        getLinearLoader(Module.employeeManagement, SubModule.employeeViewDetails, 'view-details').should('exist');

        interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 100 });
        cy.wait('@fetchEmployeeByIdRequest');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'view-profile-button').should('exist').click();

        cy.url().should('include', ROUTES.viewProfile.path);
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
      interceptFetchBranchesByIdsRequest();
      cy.visit(ROUTES.employees.path);

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-firstName')
        .find('p')
        .click();

      cy.url().should('include', `${ROUTES.employees.path}/view/333333333335`);

      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
      );

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeViewDetails, 'page-title-back-button').click();

      cy.url().should('include', ROUTES.employees.path);

      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333335');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'page-title-back-button').click();

      cy.url().should('include', ROUTES.employees.path);
    });

    it('should reset the form and navigate to the Employee Catalog page if the cancel button is clicked', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesByIdsRequest();
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      cy.visit(ROUTES.employees.path);

      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333335');

      cy.url().should('include', `${ROUTES.employees.path}/edit/333333333335`);

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchBranchByIdRequest', '@fetchAssignedBranchesRequest']);

      testEmployeeFormFields();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();
      getTestSelectorByModule(
        Module.employeeManagement,
        SubModule.employeeDetails,
        'form-field-assignedBranchId-option-222222222223'
      ).click();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', ROUTES.employees.path);

      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333335');

      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': 'New York Branch',
      });
    });

    it('should reset the form when navigating between different employees', () => {
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100, search: '*' },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesByIdsRequest();
      interceptFetchEmployeeByIdRequest('333333333334', 'fetchFirstEmployeeByIdRequest', 'employee/employees-multiple');
      interceptFetchEmployeeByIdRequest('333333333335', 'fetchSecondEmployeeByIdRequest', 'employee/employees-multiple');
      cy.visit(ROUTES.employees.path);

      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333334');
      cy.wait('@fetchFirstEmployeeByIdRequest');

      verifyTextFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-label-firstName': 'First Name',
        'form-field-value-firstName': 'Aziraphale',
        'form-field-label-lastName': 'Last Name',
        'form-field-value-lastName': 'Fell',
        'form-field-label-fullName': 'Full Name',
        'form-field-value-fullName': 'Aziraphale User Fell',
      });
      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': '',
      });

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-cancel-button').click();
      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333335');

      cy.wait('@fetchSecondEmployeeByIdRequest');

      testEmployeeFormFields();
    });

    it('should not be able to edit the employee if the employee update failed', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptEditEmployeeFailedRequest('333333333335');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.wait('@fetchEmployeeByIdRequest');

      clickActionButton(Module.employeeManagement, SubModule.employeeDetails);

      cy.wait('@editEmployeeFailedRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Employee');
    });

    it('should display async validation messages if the employee update failed with validation errors', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptEditEmployeeFailedWithErrorRequest('333333333335');
      interceptFetchBranchesByIdsRequest();
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchBranchByIdRequest', '@fetchAssignedBranchesRequest']);

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();
      getTestSelectorByModule(
        Module.employeeManagement,
        SubModule.employeeDetails,
        'form-field-assignedBranchId-option-222222222223'
      ).click();

      clickActionButton(Module.employeeManagement, SubModule.employeeDetails);
      cy.wait('@editEmployeeFailedWithErrorRequest');

      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'error')
        .should('exist')
        .and('contain.text', 'Failed to update the Employee');
      verifyFormValidationMessages(Module.employeeManagement, SubModule.employeeDetails, [
        {
          field: 'form-field-assignedBranchId-validation',
          message: `'Hawaii Branch' has been removed. Please choose different branch.`,
        },
      ]);
      cy.url().should('include', `${ROUTES.employees.path}/edit/333333333335`);
    });

    it('should be able to edit the employee and be navigated to the Employee Catalog page if the employee update succeeded', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptEditEmployeeRequest('333333333335');
      interceptFetchBranchesByIdsRequest();
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      cy.visit(ROUTES.employees.path);

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-firstName')
        .find('p')
        .should('exist')
        .and('have.text', 'Anthony');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-lastName')
        .should('exist')
        .and('have.text', 'Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-fullName')
        .should('exist')
        .and('have.text', 'Anthony User Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-assignedBranchName')
        .should('exist')
        .and('have.text', 'New York Branch');

      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333335');

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchBranchByIdRequest', '@fetchAssignedBranchesRequest']);

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();
      getTestSelectorByModule(
        Module.employeeManagement,
        SubModule.employeeDetails,
        'form-field-assignedBranchId-option-222222222223'
      ).click();

      clickActionButton(Module.employeeManagement, SubModule.employeeDetails);
      cy.wait('@editEmployeeRequest');

      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchMultipleEmployeesUpdatedRequest', fixture: 'employee/employees-multiple-updated' }
      );
      interceptFetchBranchesByIdsRequest({ alias: 'fetchBranchesByIdsRequest', fixture: 'branch/branches-multiple' });

      cy.url().should('include', ROUTES.employees.path);
      getLinearLoader(Module.employeeManagement, SubModule.employeeCatalog, 'table').should('exist');

      cy.wait('@fetchMultipleEmployeesUpdatedRequest');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-row', true).should('have.length', 3);
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-firstName')
        .find('p')
        .should('exist')
        .and('have.text', 'Anthony');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-lastName')
        .should('exist')
        .and('have.text', 'Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-fullName')
        .should('exist')
        .and('have.text', 'Anthony User Crowley');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeCatalog, 'table-body-cell-333333333335-assignedBranchName')
        .should('exist')
        .and('have.text', 'Hawaii Branch');
      getTestSelectorByModule(Module.shared, SubModule.snackbar, 'success')
        .should('exist')
        .and('contain.text', 'Employee has been successfully updated');
    });

    it('should fetch and display the employee view details by id when refreshing the page', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit(`${ROUTES.employees.path}/view/333333333335`);

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
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.reload();

      getLinearLoader(Module.employeeManagement, SubModule.employeeDetails, 'form').should('exist');
      cy.wait('@fetchEmployeeByIdRequest');

      testEmployeeFormFields();
    });

    it('should fetch and display the assigned branches when scrolling down the assigned branch field', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequestPage1', fixture: 'branch/branches-multiple-page-one' }
      );
      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchBranchByIdRequest']);
      cy.wait('@fetchAssignedBranchesRequestPage1').its('request.url').should('include', 'Branches?pageNumber=1&pageSize=10');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option', true).should(
        'have.length',
        10
      );

      interceptFetchBranchesRequest(
        { pageNumber: 2, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequestPage2', fixture: 'branch/branches-multiple-page-two' }
      );

      cy.get('[role="list-box"]').should('exist');
      cy.get('[role="list-box"]').then(($listbox) => {
        $listbox[0].scrollTop = $listbox[0].scrollHeight;
        $listbox[0].dispatchEvent(new Event('scroll', { bubbles: true }));
      });

      cy.wait('@fetchAssignedBranchesRequestPage2').its('request.url').should('include', 'Branches?pageNumber=2&pageSize=10');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option', true).should(
        'have.length',
        20
      );

      interceptFetchBranchesRequest(
        { pageNumber: 3, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequestPage3', fixture: 'branch/branches-multiple-page-three' }
      );

      cy.get('[role="list-box"]').then(($listbox) => {
        $listbox[0].scrollTop = $listbox[0].scrollHeight;
        $listbox[0].dispatchEvent(new Event('scroll', { bubbles: true }));
      });

      cy.wait('@fetchAssignedBranchesRequestPage3').its('request.url').should('include', 'Branches?pageNumber=3&pageSize=10');

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option', true).should(
        'have.length',
        22
      );

      cy.intercept('GET', '**/Branches?pageNumber=4&pageSize=10').as('fetchAssignedBranchesRequestPage4');

      cy.get('[role="list-box"]').scrollTo('bottom');

      cy.get('@fetchAssignedBranchesRequestPage4.all').should('have.length', 0);
    });

    it('should display the assigned branch even if it is not in the first page of the assigned branches field', () => {
      interceptFetchEmployeeByIdRequest('333333333335', 'fetchEmployeeByIdRequest', 'employee/employees-different-page-assigned-branch');
      interceptFetchBranchByIdRequest('222222222241', 'fetchBranchByIdRequest', 'branch/branches-multiple-page-two');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequestPage1', fixture: 'branch/branches-multiple-page-one' }
      );
      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchBranchByIdRequest', '@fetchAssignedBranchesRequestPage1']);

      verifyInputFields(Module.employeeManagement, SubModule.employeeDetails, {
        'form-field-assignedBranchId-input': 'Anchorage Branch',
      });

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId').click();

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option', true).should(
        'have.length',
        11
      );
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-assignedBranchId-option-222222222241')
        .should('exist')
        .and('have.text', 'Anchorage Branch');
    });

    it('should not fetch the branch geo address, even though the fetching of the geo address is part of the fetchBranchByIdRequest', () => {
      interceptFetchEmployeeByIdRequest('333333333335');
      interceptFetchBranchByIdRequest('222222222222');
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 100 },
        { alias: 'fetchMultipleBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      cy.intercept('GET', '**/openstreetmap.org/search').as('fetchBranchGeoAddressRequest');
      cy.visit(`${ROUTES.employees.path}/edit/333333333335`);

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchBranchByIdRequest']);
      cy.get('@fetchBranchGeoAddressRequest.all').should('have.length', 0);
    });
  });
});
