/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginMock(isAdmin?: boolean, expiresIn?: number): Chainable<Subject>;
    logoutMock(): Chainable<Subject>;
    interceptWithAuth(
      method: string,
      url: string | RegExp,
      response: any,
      alias?: string,
      statusCode?: number,
      delay?: number
    ): Chainable<Subject>;
  }
}
