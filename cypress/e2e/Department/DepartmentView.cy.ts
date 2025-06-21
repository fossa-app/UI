import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import { getLinearLoader, getTestSelectorByModule, selectAction, verifyInputFields, verifyTextFields } from '../../support/helpers';
import {
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchDepartmentByIdFailedRequest,
  interceptFetchDepartmentByIdRequest,
  interceptFetchDepartmentsByIdsRequest,
  interceptFetchDepartmentsRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchEmployeesByIdsRequest,
  interceptFetchEmployeesRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../../support/interceptors';

const testDepartmentFields = () => {
  verifyTextFields(Module.departmentManagement, SubModule.departmentViewDetails, {
    'view-details-header': 'Department Details',
    'view-details-section-basicInfo': 'Basic Information',
    'view-details-label-name': 'Name',
    'view-details-value-name': 'Production',
    'view-details-label-parentDepartmentName': 'Parent Department',
    'view-details-value-parentDepartmentName': '-',
    'view-details-label-managerName': 'Manager',
    'view-details-value-managerName': 'Anthony User Crowley',
  });
};

const testDepartmentEmptyFormFields = () => {
  verifyInputFields(Module.departmentManagement, SubModule.departmentDetails, {
    'form-field-name': '',
    'form-field-parentDepartmentId': '',
    'form-field-managerId': '',
  });
};

describe('Department View Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchOnboardingBranchesRequest' });
    interceptFetchProfileRequest();
  });

  const roles = [
    {
      role: 'User',
      loginMock: () => cy.loginMock(),
    },
    {
      role: 'Admin',
      loginMock: () => cy.loginMock(true),
    },
  ];

  roles.forEach(({ role, loginMock }) => {
    describe(`${role} Role`, () => {
      beforeEach(() => {
        loginMock();
      });

      it('should be able to view the department and navigate back', () => {
        interceptFetchDepartmentsRequest();
        interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
        interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
        interceptFetchDepartmentByIdRequest('444444444444');
        interceptFetchEmployeeByIdRequest('333333333335');
        cy.visit(ROUTES.departments.path);

        selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'view', '444444444444');

        getLinearLoader(Module.departmentManagement, SubModule.departmentViewDetails, 'view-details').should('exist');

        cy.wait('@fetchDepartmentByIdRequest');

        testDepartmentFields();
        getTestSelectorByModule(Module.departmentManagement, SubModule.departmentViewDetails, 'page-title-back-button').click();

        cy.url().should('include', ROUTES.departments.path);
        getLinearLoader(Module.departmentManagement, SubModule.departmentCatalog, 'table').should('not.exist');
      });

      it('should fetch and display the department view details by id when refreshing the page', () => {
        interceptFetchDepartmentByIdRequest('444444444444');
        interceptFetchEmployeeByIdRequest('333333333335');
        cy.visit(`${ROUTES.departments.path}/view/444444444444`);

        cy.wait('@fetchDepartmentByIdRequest');

        testDepartmentFields();
        cy.reload();

        getLinearLoader(Module.departmentManagement, SubModule.departmentViewDetails, 'view-details').should('exist');
        cy.wait('@fetchDepartmentByIdRequest');

        testDepartmentFields();
      });

      it('should not display the loader if the request resolves quickly', () => {
        interceptFetchDepartmentByIdRequest('444444444444', 'fetchDepartmentByIdQuickRequest', 'department/departments', 200, 50);
        interceptFetchEmployeeByIdRequest('333333333335');
        cy.visit(`${ROUTES.departments.path}/view/444444444444`);

        getLinearLoader(Module.departmentManagement, SubModule.departmentViewDetails, 'view-details').should('not.exist');

        cy.wait('@fetchDepartmentByIdQuickRequest');

        getLinearLoader(Module.departmentManagement, SubModule.departmentViewDetails, 'view-details').should('not.exist');
      });

      it('should display default values if there is no parent department provided', () => {
        interceptFetchDepartmentByIdRequest('444444444447');
        interceptFetchEmployeeByIdRequest('333333333333');
        cy.visit(`${ROUTES.departments.path}/view/444444444447`);

        cy.wait('@fetchDepartmentByIdRequest');

        getTestSelectorByModule(Module.departmentManagement, SubModule.departmentViewDetails, 'view-details-value-parentDepartmentName')
          .find('p')
          .should('have.text', '-');
      });

      it('should display not found page if the department was not found', () => {
        interceptFetchDepartmentByIdFailedRequest('444444444443');
        interceptFetchEmployeeByIdRequest('333333333333');
        cy.visit(`${ROUTES.departments.path}/view/444444444443`);

        getTestSelectorByModule(Module.shared, SubModule.notFound, 'page-title').should('exist').and('contain.text', 'Page Not Found');
        getTestSelectorByModule(Module.shared, SubModule.notFound, 'navigate-home-button').should('exist').click();
        cy.location('pathname').should('eq', ROUTES.flows.path);
      });
    });
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
    });

    it('should not render the Edit department button', () => {
      interceptFetchDepartmentByIdRequest('444444444444');
      interceptFetchEmployeeByIdRequest('333333333335');
      cy.visit(`${ROUTES.departments.path}/view/444444444444`);

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentViewDetails, 'view-action-button').should('not.exist');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should reset the department after viewing and navigating back', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
      interceptFetchEmployeesRequest();
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
      interceptFetchDepartmentByIdRequest('444444444444');
      interceptFetchEmployeeByIdRequest('333333333335');
      cy.visit(ROUTES.departments.path);

      selectAction(Module.departmentManagement, SubModule.departmentCatalog, 'view', '444444444444');

      cy.wait('@fetchDepartmentByIdRequest');
      cy.wait('@fetchEmployeeByIdRequest');
      // TODO: flaky test, waiting solves the issue
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200);

      testDepartmentFields();

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentViewDetails, 'page-title-back-button').click();
      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentCatalog, 'table-layout-action-button').click();

      cy.url().should('include', ROUTES.newDepartment.path);
      testDepartmentEmptyFormFields();
    });

    it('should render the Edit department button', () => {
      interceptFetchDepartmentsRequest();
      interceptFetchEmployeesByIdsRequest({ ids: [333333333335, 333333333334, 333333333333] });
      interceptFetchEmployeesRequest();
      interceptFetchDepartmentsByIdsRequest({ ids: [444444444444] });
      interceptFetchDepartmentByIdRequest('444444444444');
      interceptFetchEmployeeByIdRequest('333333333335');
      cy.visit(`${ROUTES.departments.path}/view/444444444444`);

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', `${ROUTES.departments.path}/edit/444444444444`);

      getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', ROUTES.departments.path);
    });
  });
});
