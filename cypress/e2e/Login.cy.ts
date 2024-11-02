describe('Login Page', () => {
  it('should render the login form', () => {
    cy.visit('/login');

    cy.get('[data-cy="login-button"]').should('exist');

    cy.contains('Login').should('exist');
  });
});
