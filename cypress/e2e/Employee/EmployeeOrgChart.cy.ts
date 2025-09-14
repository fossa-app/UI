import { ROUTES } from 'shared/constants';
import { Module, SubModule } from 'shared/models';
import {
  checkEmployeeReportsTo,
  clickActionButton,
  clickFlowsIcon,
  clickSubFlow,
  getTestSelectorByModule,
  selectAction,
} from 'support/helpers';
import {
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
  interceptFetchCompanySettingsRequest,
  interceptFetchEmployeesRequest,
  interceptFetchBranchesRequest,
  interceptFetchEmployeesByIdsRequest,
  interceptFetchBranchesByIdsRequest,
  interceptFetchDepartmentsByIdsRequest,
  interceptFetchEmployeeByIdRequest,
  interceptFetchDepartmentsRequest,
  interceptEditEmployeeRequest,
} from 'support/interceptors';

describe('Employee Organization Chart Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyRequest();
    interceptFetchCompanySettingsRequest();
    interceptFetchCompanyLicenseRequest();
    interceptFetchProfileRequest();
    interceptFetchBranchesRequest({ pageNumber: 1, pageSize: 1 }, { alias: 'fetchBranchesTotalRequest' });
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

      it('should render the Organization Chart with top level employees only', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: true },
          { alias: 'fetchTopEmployeesRequest', fixture: 'employee/employees-top' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333333 },
          { alias: 'fetchSubordinatesGabrielRequestRequest', fixture: 'employee/employees-empty' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333334 },
          { alias: 'fetchSubordinatesAziraphaleRequest', fixture: 'employee/employees-empty' }
        );
        cy.visit(ROUTES.employeeOrgChart.path);

        cy.get('[data-cy="linear-loader"]').should('exist');

        cy.wait(['@fetchTopEmployeesRequest', '@fetchSubordinatesGabrielRequestRequest', '@fetchSubordinatesAziraphaleRequest']);

        cy.get('[data-cy="linear-loader"]').should('not.exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'org-chart-root-tree-333333333333').should('exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'org-chart-root-tree-333333333334').should('exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-card', true).should('have.length', 2);
        checkEmployeeReportsTo('333333333333', null);
        checkEmployeeReportsTo('333333333334', null);
      });

      it('should render the Organization Chart with top level and subordinate employees', () => {
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: true },
          { alias: 'fetchTopEmployeesRequest', fixture: 'employee/employees-top' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333333 },
          { alias: 'fetchSubordinatesGabrielRequestRequest', fixture: 'employee/employees-sub-333333333333' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333334 },
          { alias: 'fetchSubordinatesAziraphaleRequest', fixture: 'employee/employees-empty' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333335 },
          { alias: 'fetchSubordinatesAnthonyRequest', fixture: 'employee/employees-sub-333333333335' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333337 },
          { alias: 'fetchSubordinatesMichaelRequest', fixture: 'employee/employees-empty' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333338 },
          { alias: 'fetchSubordinatesShadwellRequest', fixture: 'employee/employees-empty' }
        );
        interceptFetchEmployeesRequest(
          { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333342 },
          { alias: 'fetchSubordinatesMadameRequest', fixture: 'employee/employees-empty' }
        );
        cy.visit(ROUTES.employeeOrgChart.path);

        cy.get('[data-cy="linear-loader"]').should('exist');

        cy.wait([
          '@fetchTopEmployeesRequest',
          '@fetchSubordinatesGabrielRequestRequest',
          '@fetchSubordinatesAziraphaleRequest',
          '@fetchSubordinatesAnthonyRequest',
          '@fetchSubordinatesMichaelRequest',
          '@fetchSubordinatesShadwellRequest',
          '@fetchSubordinatesMadameRequest',
        ]);

        cy.get('[data-cy="linear-loader"]').should('not.exist');

        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'page-title')
          .should('exist')
          .and('have.text', 'Organization Chart');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'org-chart-root-tree', true).should(
          'have.length',
          2
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'org-chart-root-tree-333333333333').should('exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'org-chart-root-tree-333333333334').should('exist');
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-card', true).should('have.length', 6);
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-content-card-333333333333-avatar').should(
          'have.text',
          'GA'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-content-card-333333333333-name').should(
          'have.text',
          'Gabriel Admin Archangel'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-content-card-333333333334-avatar').should(
          'have.text',
          'AF'
        );
        getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-content-card-333333333334-name').should(
          'have.text',
          'Aziraphale User Fell'
        );
        checkEmployeeReportsTo('333333333333', null);
        checkEmployeeReportsTo('333333333334', null);
        checkEmployeeReportsTo('333333333335', '333333333333');
        checkEmployeeReportsTo('333333333337', '333333333333');
        checkEmployeeReportsTo('333333333338', '333333333335');
        checkEmployeeReportsTo('333333333342', '333333333335');
      });
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should update the Organization Chart if an employee has been updated', () => {
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchEmployeesRequest', fixture: 'employee/employees-multiple' }
      );
      interceptFetchEmployeesByIdsRequest();
      interceptFetchBranchesByIdsRequest();
      interceptFetchDepartmentsByIdsRequest();
      interceptFetchBranchesRequest(
        { pageNumber: 1, pageSize: 10 },
        { alias: 'fetchAssignedBranchesRequest', fixture: 'branch/branches-multiple' }
      );
      interceptFetchDepartmentsRequest({ pageNumber: 1, pageSize: 10 }, { alias: 'fetchAssignedDepartmentsRequest' });
      interceptFetchEmployeeByIdRequest('333333333334', 'fetchEmployeeByIdRequest', 'employee/employees-multiple-page-one');
      interceptEditEmployeeRequest('333333333334');

      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: true },
        { alias: 'fetchTopEmployeesRequest', fixture: 'employee/employees-top-updated' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333333 },
        { alias: 'fetchSubordinatesGabrielRequestRequest', fixture: 'employee/employees-sub-333333333333' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333334 },
        { alias: 'fetchSubordinatesAziraphaleRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333335 },
        { alias: 'fetchSubordinatesAnthonyRequest', fixture: 'employee/employees-sub-333333333335-updated' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333337 },
        { alias: 'fetchSubordinatesMichaelRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333338 },
        { alias: 'fetchSubordinatesShadwellRequest', fixture: 'employee/employees-empty' }
      );
      interceptFetchEmployeesRequest(
        { pageNumber: 1, pageSize: 10, topLevelOnly: false, reportsToId: 333333333342 },
        { alias: 'fetchSubordinatesMadameRequest', fixture: 'employee/employees-empty' }
      );
      cy.visit(ROUTES.employees.path);

      cy.wait('@fetchEmployeesRequest');

      selectAction(Module.employeeManagement, SubModule.employeeCatalog, 'edit', '333333333334');

      cy.wait(['@fetchEmployeeByIdRequest', '@fetchAssignedBranchesRequest', '@fetchAssignedDepartmentsRequest']);

      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-reportsToId').click();
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeDetails, 'form-field-reportsToId-option-333333333335').click();

      clickActionButton(Module.employeeManagement, SubModule.employeeDetails);
      cy.wait('@editEmployeeRequest');

      clickFlowsIcon();
      clickSubFlow('Organization Chart');

      cy.get('[data-cy="linear-loader"]').should('exist');

      cy.wait([
        '@fetchTopEmployeesRequest',
        '@fetchSubordinatesGabrielRequestRequest',
        '@fetchSubordinatesAziraphaleRequest',
        '@fetchSubordinatesAnthonyRequest',
        '@fetchSubordinatesMichaelRequest',
        '@fetchSubordinatesShadwellRequest',
        '@fetchSubordinatesMadameRequest',
      ]);

      cy.get('[data-cy="linear-loader"]').should('not.exist');
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'employee-card', true).should('have.length', 6);
      getTestSelectorByModule(Module.employeeManagement, SubModule.employeeOrgChart, 'org-chart-root-tree', true).should('have.length', 1);
      checkEmployeeReportsTo('333333333333', null);
      checkEmployeeReportsTo('333333333334', '333333333335');
      checkEmployeeReportsTo('333333333335', '333333333333');
      checkEmployeeReportsTo('333333333337', '333333333333');
      checkEmployeeReportsTo('333333333338', '333333333335');
      checkEmployeeReportsTo('333333333342', '333333333335');
    });
  });
});
