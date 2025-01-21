/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable<T = void> {
      loginMock(isAdmin?: boolean, expiresIn?: number): Chainable<T>;
      logoutMock(): Chainable<T>;
      // TODO: pass params as options/config/object
      interceptWithAuth(
        method: string,
        url: string | RegExp,
        response: any,
        alias?: string,
        statusCode?: number,
        delay?: number
      ): Chainable<T>;
    }
  }
}
