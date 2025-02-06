import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getTestSelectorByModule } from '../support/helpers';
import {
  interceptEditBranchRequest,
  interceptFetchBranchByIdFailedRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchEmployeeRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

describe('Branch View Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
    interceptFetchEmployeeRequest();
  });

  describe('User Role', () => {
    beforeEach(() => {
      cy.loginMock();
    });

    it('should not render the Edit branch button', () => {
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches/view/222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-action-button').should('not.exist');
    });
  });

  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginMock(true);
    });

    it('should display not found page if the branch was not found', () => {
      interceptFetchBranchByIdFailedRequest('222222222224');
      cy.visit('/manage/branches/view/222222222224');

      cy.get('[data-cy="not-found-page-title"]').should('exist').and('contain.text', 'Page Not Found');
      cy.get('[data-cy="not-found-page-button"]').should('exist').click();
      cy.url().should('include', '/manage/company');
    });

    it('should be able to view the branch and navigate back', () => {
      interceptEditBranchRequest('222222222222');
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();

      getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('exist');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-header').should(
        'have.text',
        'Branch Details'
      );
      cy.wait('@fetchBranchByIdRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-name').should(
        'have.text',
        'Branch Name'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-name').should(
        'have.text',
        'New York Branch'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-timeZoneName').should(
        'have.text',
        'TimeZone'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-timeZoneName')
        .should('have.text', 'Eastern Standard Time')
        .find('p')
        .should('not.have.attr', 'data-invalid');
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-address.line1').should(
        'have.text',
        'Address Line 1'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-address.line1').should(
        'have.text',
        '270 W 11th Street'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-address.line2').should(
        'have.text',
        'Address Line 2'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-address.line2').should(
        'have.text',
        'Apt 2E'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-address.city').should(
        'have.text',
        'City'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-address.city').should(
        'have.text',
        'New York'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-address.subdivision').should(
        'have.text',
        'State'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-address.subdivision').should(
        'have.text',
        'NY'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-address.countryName').should(
        'have.text',
        'Country'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-address.countryName').should(
        'have.text',
        'United States'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-label-address.postalCode').should(
        'have.text',
        'Postal Code'
      );
      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-address.postalCode').should(
        'have.text',
        '10014'
      );

      cy.get('[data-cy="page-title-back-button"]').click();

      cy.url().should('include', '/manage/branches');
      getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
    });

    it('should reset the branch after viewing and navigating back', () => {
      interceptFetchBranchByIdRequest('222222222222', 'fetchBranchByIdRequest', 'branches');
      cy.visit('/manage/branches');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'actions-menu-icon-222222222222').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'action-view-222222222222').click();
      cy.wait('@fetchBranchByIdRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-name').should(
        'have.text',
        'New York Branch'
      );

      cy.get('[data-cy="page-title-back-button"]').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

      cy.url().should('include', '/manage/branches/new');
      // TODO: flaky part
      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').should('have.value', '');
    });

    it('should fetch and display the branch by id when refreshing the page', () => {
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches/view/222222222222');

      cy.reload();

      getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('exist');
      cy.wait('@fetchBranchByIdRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-item-value-name').should(
        'have.text',
        'New York Branch'
      );
    });

    it('should not display the loader if the request resolves quickly', () => {
      interceptFetchBranchByIdRequest('222222222222', 'fetchBranchByIdQuickRequest', 'branches', 200, 50);
      cy.visit('/manage/branches/view/222222222222');

      getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('not.exist');
      cy.wait('@fetchBranchByIdQuickRequest');
    });

    it('should mark the fields as invalid if the company country is different than the branch address country', () => {
      interceptFetchCompanyRequest('fetchUpdatedCompanyRequest', 'company-updated');
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches/view/222222222222');

      cy.wait('@fetchUpdatedCompanyRequest');
      cy.wait('@fetchBranchByIdRequest');

      const invalidFields = [
        'timeZoneName',
        'address.line1',
        'address.line2',
        'address.city',
        'address.subdivision',
        'address.countryName',
        'address.postalCode',
      ];

      invalidFields.forEach((field) => {
        getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, `view-details-item-value-${field}`)
          .find('p')
          .should('have.attr', 'data-invalid');
      });
    });

    it('should display default values if there is no address provided', () => {
      interceptFetchBranchByIdRequest('222222222225', 'fetchBranchByIdRequest', 'branches-multiple-different-countries');
      cy.visit('/manage/branches/view/222222222225');

      cy.wait('@fetchBranchByIdRequest');

      const emptyFields = [
        'address.line1',
        'address.line2',
        'address.city',
        'address.subdivision',
        'address.countryName',
        'address.postalCode',
      ];

      emptyFields.forEach((field) => {
        getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, `view-details-item-value-${field}`)
          .find('p')
          .should('have.text', '-');
      });
    });

    it('should render the Edit branch button', () => {
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches/view/222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', '/manage/branches/edit/222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', '/manage/branches');
    });

    // TODO: test sections
  });
});
