import { Module, SubModule } from '../../src/shared/models';

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

export const getCompanyLicenseDialogElement = (elementSelector: string) => {
  return cy.get('[data-cy="company-license-dialog"]').find(`[data-cy=${elementSelector}]`);
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
