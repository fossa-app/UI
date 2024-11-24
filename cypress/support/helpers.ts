import { Module, SubModule } from '../../src/shared/models';

export const getTableLoader = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="linear-loader"]');
};

export const getTablePaginationSizeInput = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="table-pagination"] .MuiTablePagination-input input');
};

export const getTablePaginationDisplayedRows = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="table-pagination"] .MuiTablePagination-displayedRows');
};

export const getTableBodyRow = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="table-body-row"]');
};

export const getFormLoader = (formSelector: string) => {
  return cy.get(`[data-cy=${formSelector}]`).find('[data-cy="linear-loader"]');
};

export const getCompanyLicenseDialogElement = (elementSelector: string) => {
  return cy.get('[data-cy="company-license-dialog"]').find(`[data-cy=${elementSelector}]`);
};

export const uploadFile = (selector: string, fixtureName: string, fileType = 'application/octet-stream') => {
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

export const getTestSelectorByModule = (module: Module, subModule: SubModule, selector: string) => {
  return cy.get(`[data-cy=${module}-${subModule}-${selector}]`);
};
