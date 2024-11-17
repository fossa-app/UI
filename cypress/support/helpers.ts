export const getTableLoader = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="linear-loader"]');
};

export const getTablePaginationSizeInput = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="table-pagination"] .MuiTablePagination-input input');
};

export const getTablePaginationDisplayedRows = (tableSelector: string) => {
  return cy.get(`[data-cy=${tableSelector}]`).find('[data-cy="table-pagination"] .MuiTablePagination-displayedRows');
};
