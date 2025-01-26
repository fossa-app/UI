import { BranchDTO, Module, SubModule } from '../../src/shared/models';

export const getTestSelectorByModule = (module: Module, subModule: SubModule, selector: string) => {
  return cy.get(`[data-cy="${module}-${subModule}-${selector}"]`);
};

export const getLinearLoader = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('[data-cy="linear-loader"]');
};

export const getTablePaginationSizeInput = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('.MuiTablePagination-input input');
};

export const getTablePaginationDisplayedRows = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('.MuiTablePagination-displayedRows');
};

export const getLoadingButtonLoadingIcon = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('[data-cy="loading-button-end-icon"]');
};

export const getCompanyLicenseDialogElement = (selector: string) => {
  return cy.get('[data-cy="company-license-dialog"]').find(`[data-cy=${selector}]`);
};

export const selectOption = (module: Module, subModule: SubModule, fieldName: string, optionName: string) => {
  getTestSelectorByModule(module, subModule, `form-field-${fieldName}`).click();
  getTestSelectorByModule(module, subModule, `form-field-${fieldName}-option-${optionName}`).click();
};

export const openUserProfile = () => {
  cy.get('[data-cy="user-avatar"]').click();
  cy.get('[data-cy="user-name"]').should('exist').click();
};

export const fillBranchDetailsForm = (branch: BranchDTO) => {
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').type(branch.name);
  selectOption(Module.branchManagement, SubModule.branchDetails, 'timeZoneId', branch.timeZoneId);
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.line1').type(branch.address.line1!);
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.line2').type(branch.address.line2!);
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.city').type(branch.address.city!);
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.subdivision').type(
    branch.address.subdivision!
  );
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.postalCode').type(
    branch.address.postalCode!
  );
  selectOption(Module.branchManagement, SubModule.branchDetails, 'address.countryCode', branch.address.countryCode!);
};

export const clearBranchDetailsForm = () => {
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-name').find('input').clear();
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.line1').find('input').clear();
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.line2').find('input').clear();
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.city').find('input').clear();
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.subdivision').find('input').clear();
  getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, 'form-field-address.postalCode').find('input').clear();
};

export const verifyBranchDetailsFormFieldValues = (fieldValues: { [key: string]: string }) => {
  Object.entries(fieldValues).forEach(([field, value]) => {
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, field).find('input').should('have.value', value);
  });
};

export const verifyBranchDetailsFormValidationMessages = (validations: { field: string; message: string }[]) => {
  validations.forEach(({ field, message }) => {
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, field).should('exist').and('have.text', message);
  });
};

export const uploadTestFile = (selector: string, fixtureName: string, fileType = 'application/octet-stream') => {
  cy.fixture(fixtureName, 'binary').then((fileContent) => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, fileType);
    const file = new File([blob], fixtureName, { type: fileType });

    cy.get(selector).then(($input) => {
      const inputElement = $input[0] as HTMLInputElement;
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(file);
      inputElement.files = dataTransfer.files;

      cy.wrap($input).trigger('change', { force: true });
    });
  });
};
