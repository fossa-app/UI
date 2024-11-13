const serverBaseUrl = Cypress.env('serverBaseUrl');
const fusionAuthBaseUrl = Cypress.env('fusionAuthBaseUrl');

export const interceptFetchSystemLicenseRequest = () => {
  cy.fixture('system-license').then((systemLicense) => {
    cy.intercept('GET', `${serverBaseUrl}/License/System`, { body: systemLicense }).as('fetchSystemLicenseRequest');
  });
};

export const interceptFetchClientRequest = () => {
  cy.fixture('client').then((client) => {
    cy.intercept('GET', `${serverBaseUrl}/Identity/Client?origin=${Cypress.config('baseUrl')}`, { body: client }).as('fetchClientRequest');
  });
};

export const interceptLoginRequest = () => {
  cy.intercept('GET', `${fusionAuthBaseUrl}/oauth2/authorize*`, { statusCode: 302 }).as('loginRequest');
};

export const interceptFetchTokenRequest = () => {
  cy.fixture('token').then((token) => {
    cy.intercept(
      {
        method: 'POST',
        url: `${fusionAuthBaseUrl}/oauth2/token`,
      },
      { statusCode: 200, body: token }
    ).as('fetchTokenRequest');
  });
};

export const interceptFetchCompanyRequest = () => {
  cy.fixture('company').then((company) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${serverBaseUrl}/Company`,
        headers: {
          Authorization: /^Bearer .+$/,
        },
      },
      { statusCode: 200, body: company }
    ).as('fetchCompanyRequest');
  });
};

export const interceptFetchCompanyFailedRequest = () => {
  cy.intercept(
    {
      method: 'GET',
      url: `${serverBaseUrl}/Company`,
      headers: {
        Authorization: /^Bearer .+$/,
      },
    },
    { statusCode: 404, body: {} }
  ).as('fetchCompanyFailedRequest');
};

export const interceptFetchCompanyLicenseRequest = () => {
  cy.fixture('company-license').then((companyLicense) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${serverBaseUrl}/License/Company`,
        headers: {
          Authorization: /^Bearer .+$/,
        },
      },
      { statusCode: 200, body: companyLicense }
    ).as('fetchCompanyLicenseRequest');
  });
};

export const interceptFetchCompanyLicenseFailedRequest = () => {
  cy.intercept(
    {
      method: 'GET',
      url: `${serverBaseUrl}/License/Company`,
      headers: {
        Authorization: /^Bearer .+$/,
      },
    },
    { statusCode: 404, body: {} }
  ).as('fetchCompanyLicenseFailedRequest');
};

export const interceptFetchBranchesRequest = () => {
  cy.fixture('branches').then((branches) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${serverBaseUrl}/Branches*`,
        headers: {
          Authorization: /^Bearer .+$/,
        },
      },
      { statusCode: 200, body: branches }
    ).as('fetchBranchesRequest');
  });
};

export const interceptFetchBranchesFailedRequest = () => {
  cy.fixture('empty-branches').then((emptyBranches) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${serverBaseUrl}/Branches*`,
        headers: {
          Authorization: /^Bearer .+$/,
        },
      },
      { statusCode: 200, body: emptyBranches }
    ).as('fetchBranchesFailedRequest');
  });
};

export const interceptFetchEmployeeRequest = () => {
  cy.fixture('employee').then((employee) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${serverBaseUrl}/Employee`,
        headers: {
          Authorization: /^Bearer .+$/,
        },
      },
      { statusCode: 200, body: employee }
    ).as('fetchEmployeeRequest');
  });
};

export const interceptFetchEmployeeFailedRequest = () => {
  cy.intercept(
    {
      method: 'GET',
      url: `${serverBaseUrl}/Employee`,
      headers: {
        Authorization: /^Bearer .+$/,
      },
    },
    { statusCode: 404, body: {} }
  ).as('fetchEmployeeFailedRequest');
};
