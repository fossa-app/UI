import { Branch, Module, SubModule } from '../../src/shared/models';

export const getTestSelectorByModule = (module: Module, subModule: SubModule, selector: string, isPartial = false) => {
  return isPartial ? cy.get(`[data-cy*="${module}-${subModule}-${selector}"]`) : cy.get(`[data-cy="${module}-${subModule}-${selector}"]`);
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

export const clickCheckboxField = (module: Module, subModule: SubModule, selector: string) => {
  getTestSelectorByModule(module, subModule, selector).click();
};

export const clickActionButton = (module: Module, subModule: SubModule) => {
  getTestSelectorByModule(module, subModule, 'form-action-button').click();
};

export const openUserProfile = () => {
  cy.get('[data-cy="user-avatar"]').click();
  cy.get('[data-cy="user-name"]').should('exist').click();
};

export const fillBranchDetailsForm = (module: Module, subModule: SubModule, branch: Branch) => {
  getTestSelectorByModule(module, subModule, 'form-field-name').type(branch.name);
  selectOption(module, subModule, 'timeZoneId', branch.timeZoneId);
  getTestSelectorByModule(module, subModule, 'form-field-address.line1').type(branch!.address!.line1!);

  if (branch!.address!.line2) {
    getTestSelectorByModule(module, subModule, 'form-field-address.line2').type(branch!.address!.line2);
  }

  getTestSelectorByModule(module, subModule, 'form-field-address.city').type(branch!.address!.city!);
  getTestSelectorByModule(module, subModule, 'form-field-address.subdivision').type(branch!.address!.subdivision!);
  getTestSelectorByModule(module, subModule, 'form-field-address.postalCode').type(branch!.address!.postalCode!);
  selectOption(module, subModule, 'address.countryCode', branch!.address!.countryCode!);
};

export const clearBranchDetailsForm = (module: Module, subModule: SubModule) => {
  getTestSelectorByModule(module, subModule, 'form-field-name').find('input').clear();
  getTestSelectorByModule(module, subModule, 'form-field-address.line1').find('input').clear();
  getTestSelectorByModule(module, subModule, 'form-field-address.line2').find('input').clear();
  getTestSelectorByModule(module, subModule, 'form-field-address.city').find('input').clear();
  getTestSelectorByModule(module, subModule, 'form-field-address.subdivision').find('input').clear();
  getTestSelectorByModule(module, subModule, 'form-field-address.postalCode').find('input').clear();
};

export const verifyTextFields = (module: Module, subModule: SubModule, fieldValues: { [key: string]: string }) => {
  Object.entries(fieldValues).forEach(([field, value]) => {
    getTestSelectorByModule(module, subModule, field).should('have.text', value);
  });
};

export const verifyInputFields = (module: Module, subModule: SubModule, fieldValues: { [key: string]: string }) => {
  Object.entries(fieldValues).forEach(([field, value]) => {
    getTestSelectorByModule(module, subModule, field).find('input').should('have.value', value);
  });
};

export const verifyNotExist = (module: Module, subModule: SubModule, fields: string[]) => {
  fields.forEach((field) => {
    getTestSelectorByModule(module, subModule, field).should('not.exist');
  });
};

export const verifyBranchDetailsFormFieldsExist = (fieldKeys: string[]) => {
  fieldKeys.forEach((field) => {
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, field).should('exist');
  });
};

export const verifyBranchDetailsFormFieldsNotExist = (fieldKeys: string[]) => {
  fieldKeys.forEach((field) => {
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, field).should('not.exist');
  });
};

export const verifyBranchDetailsFormValidationMessages = (
  module: Module,
  subModule: SubModule,
  validations: { field: string; message: string }[]
) => {
  validations.forEach(({ field, message }) => {
    getTestSelectorByModule(module, subModule, field).should('exist').and('have.text', message);
  });
};

export const verifyBranchDetailsFormTimeZoneOptions = (module: Module, subModule: SubModule, expectedValues: string[]) => {
  cy.get(`[data-cy^="${module}-${subModule}-form-field-timeZoneId-option"]`)
    .should('have.length', expectedValues.length)
    .then((items) => {
      cy.wrap(items).each((item, index) => {
        cy.wrap(item).invoke('attr', 'data-cy').should('include', expectedValues[index]);
      });
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
