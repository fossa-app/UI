/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginMock(isAdmin?: boolean, expiresIn?: number): Chainable<void>;
    logoutMock(): Chainable<void>;
    interceptWithAuth(method: string, url: string, response: any, alias?: string, statusCode?: number, delay?: number): Chainable<void>;
  }
}
