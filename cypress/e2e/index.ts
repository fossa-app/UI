export const OIDC_INITIAL_CONFIG_MOCK = {
  authority: 'http://localhost:9011',
  response_type: 'code',
  scope: 'openid profile email offline_access',
  client_id: '',
  redirect_uri: 'http://we.dev.localhost:4211/callback',
  post_logout_redirect_uri: 'http://we.dev.localhost:4211/',
};

const serverBaseUrl = Cypress.env('serverBaseUrl');
const fusionAuthBaseUrl = Cypress.env('fusionAuthBaseUrl');

export const interceptFetchSystemLicenseRequest = () => {
  cy.intercept('GET', `${serverBaseUrl}/License/System`, { fixture: 'system-license' }).as('fetchSystemLicenseRequest');
};

export const interceptFetchCompanyLicenseFailedRequest = () => {
  cy.intercept('GET', `${serverBaseUrl}/License/Company`, {
    statusCode: 404,
    body: {},
  }).as('fetchCompanyLicenseFailedRequest');
};

export const interceptFetchCompanyLicenseRequest = () => {
  cy.intercept('GET', `${serverBaseUrl}/License/Company`, { fixture: 'company-license' }).as('fetchCompanyLicenseRequest');
};

export const interceptFetchClientRequest = () => {
  cy.intercept('GET', `${serverBaseUrl}/Identity/Client?origin=${Cypress.config('baseUrl')}`, { fixture: 'client' }).as(
    'fetchClientRequest'
  );
};

export const interceptLoginRequest = () => {
  cy.intercept('GET', `${fusionAuthBaseUrl}/oauth2/authorize*`, { statusCode: 302 }).as('loginRequest');
};
