export const getTableLoader = () => {
  return cy.get('[data-cy="employees-table"]').find('[data-cy="linear-loader"]');
};

export const getTablePaginationSizeInput = () => {
  return cy.get('[data-cy="employees-table"]').find('[data-cy="table-pagination"] .MuiTablePagination-input input');
};

export const getTablePaginationDisplayedRows = () => {
  return cy.get('[data-cy="employees-table"]').find('[data-cy="table-pagination"] .MuiTablePagination-displayedRows');
};
