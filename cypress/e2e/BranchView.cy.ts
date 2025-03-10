import { Module, SubModule } from '../../src/shared/models';
import { getLinearLoader, getTestSelectorByModule, selectAction, verifyTextFields } from '../support/helpers';
import {
  interceptEditBranchRequest,
  interceptFetchBranchByIdFailedRequest,
  interceptFetchBranchByIdRequest,
  interceptFetchBranchesRequest,
  interceptFetchClientRequest,
  interceptFetchCompanyLicenseFailedRequest,
  interceptFetchCompanyRequest,
  interceptFetchProfileRequest,
  interceptFetchSystemLicenseRequest,
} from '../support/interceptors';

const testBranchFields = () => {
  verifyTextFields(Module.branchManagement, SubModule.branchViewDetails, {
    'view-details-header': 'Branch Details',
    'view-details-section-basicInfo': 'Basic Information',
    'view-details-section-address': 'Address Information',
    'view-details-label-name': 'Branch Name',
    'view-details-value-name': 'New York Branch',
    'view-details-label-timeZoneName': 'TimeZone',
    'view-details-value-timeZoneName': 'Eastern Standard Time',
    'view-details-label-address.line1': 'Address Line 1',
    'view-details-value-address.line1': '270 W 11th Street',
    'view-details-label-address.line2': 'Address Line 2',
    'view-details-value-address.line2': 'Apt 2E',
    'view-details-label-address.city': 'City',
    'view-details-value-address.city': 'New York',
    'view-details-label-address.subdivision': 'State',
    'view-details-value-address.subdivision': 'NY',
    'view-details-label-address.countryName': 'Country',
    'view-details-value-address.countryName': 'United States',
    'view-details-label-address.postalCode': 'Postal Code',
    'view-details-value-address.postalCode': '10014',
  });
};

describe('Branch View Tests', () => {
  beforeEach(() => {
    interceptFetchClientRequest();
    interceptFetchSystemLicenseRequest();
    interceptFetchCompanyLicenseFailedRequest();
    interceptFetchCompanyRequest();
    interceptFetchBranchesRequest();
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

      it('should be able to view the branch and navigate back', () => {
        interceptEditBranchRequest('222222222222');
        interceptFetchBranchByIdRequest('222222222222');
        cy.visit('/manage/branches');

        selectAction(Module.branchManagement, SubModule.branchTable, 'view', '222222222222');

        getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('exist');

        cy.wait('@fetchBranchByIdRequest');

        testBranchFields();
        getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-value-timeZoneName')
          .find('p')
          .should('not.have.attr', 'data-invalid');

        cy.get('[data-cy="page-title-back-button"]').click();

        cy.url().should('include', '/manage/branches');
        getLinearLoader(Module.branchManagement, SubModule.branchTable, 'table').should('not.exist');
      });

      it('should fetch and display the branch view details by id when refreshing the page', () => {
        interceptFetchBranchByIdRequest('222222222222');
        cy.visit('/manage/branches/view/222222222222');

        cy.reload();

        getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('exist');
        cy.wait('@fetchBranchByIdRequest');

        getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-value-name').should(
          'have.text',
          'New York Branch'
        );
      });

      it('should not display the loader if the request resolves quickly', () => {
        interceptFetchBranchByIdRequest('222222222222', 'fetchBranchByIdQuickRequest', 'branches', 200, 50);
        cy.visit('/manage/branches/view/222222222222');

        getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('not.exist');

        cy.wait('@fetchBranchByIdQuickRequest');

        getLinearLoader(Module.branchManagement, SubModule.branchViewDetails, 'view-details').should('not.exist');
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
          getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, `view-details-value-${field}`)
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
          getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, `view-details-value-${field}`)
            .find('p')
            .should('have.text', '-');
        });
      });

      it('should display not found page if the branch was not found', () => {
        interceptFetchBranchByIdFailedRequest('222222222224');
        cy.visit('/manage/branches/view/222222222224');

        cy.get('[data-cy="not-found-page-title"]').should('exist').and('contain.text', 'Page Not Found');
        cy.get('[data-cy="not-found-page-button"]').should('exist').click();
        cy.url().should('include', '/manage/company');
      });
    });
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

    it('should reset the branch after viewing and navigating back', () => {
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches');

      selectAction(Module.branchManagement, SubModule.branchTable, 'view', '222222222222');

      cy.wait('@fetchBranchByIdRequest');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-details-value-name').should(
        'have.text',
        'New York Branch'
      );

      cy.get('[data-cy="page-title-back-button"]').click();
      getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-layout-action-button').click();

      cy.url().should('include', '/manage/branches/new');
      // TODO: flaky part
      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name')
        .find('input')
        .should('be.visible')
        .and('have.value', '');
    });

    it('should render the Edit branch button', () => {
      interceptFetchBranchByIdRequest('222222222222');
      cy.visit('/manage/branches/view/222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchViewDetails, 'view-action-button').should('exist').click();

      cy.url().should('include', '/manage/branches/edit/222222222222');

      getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-cancel-button').should('exist').click();

      cy.url().should('include', '/manage/branches');
    });
  });
});
