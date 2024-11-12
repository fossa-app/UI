/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    // eslint-disable-next-line no-unused-vars
    loginMock(expiresIn?: number, isAdmin?: boolean): Chainable<void>;
  }
}

const createMockJwt = (isAdmin: boolean): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    roles: isAdmin ? ['administrator'] : [],
  };

  const base64Encode = (obj: Record<string, any>) => Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=/g, '');
  const encodedHeader = base64Encode(header);
  const encodedPayload = base64Encode(payload);
  const mockSignature = 'mock-signature';

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

Cypress.Commands.add('loginMock', (expiresIn?: number, isAdmin = false) => {
  const access_token = createMockJwt(isAdmin);

  const mockUser = {
    access_token,
    id_token: 'mock-id-token',
    refresh_token: 'mock-refresh-token',
    token_type: 'Bearer',
    expires_at: Math.floor(Date.now() / 1000) + (expiresIn ?? 3600 * 24 * 365 * 100),
    scope: 'openid profile email offline_access',
    profile: {
      sub: 'mock-user-id',
      tid: 'mock-tenant-id',
      given_name: 'Mock',
      middle_name: 'Oidc',
      family_name: 'User',
      name: 'Mock Oidc User',
      email: 'mockuser@example.com',
    },
  };

  localStorage.setItem('oidc.user:http://localhost:9011:mock-client-id', JSON.stringify(mockUser));
});
