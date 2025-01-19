/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable<T = void> {
      // TODO: pass params as options/config/object
      loginMock(isAdmin?: boolean, expiresIn?: number): Chainable<T>;
      logoutMock(): Chainable<T>;
      interceptWithAuth(
        method: string,
        url: string | RegExp,
        response: any,
        alias?: string,
        statusCode?: number,
        delay?: number
      ): Chainable<T>;
      setDarkTheme(): Chainable<T>;
    }
  }
}
