const baseUrl = Cypress.config('baseUrl');
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

export const interceptLogoutRequest = () => {
  cy.intercept('GET', `${fusionAuthBaseUrl}/oauth2/logout*`, {
    statusCode: 302,
    headers: {
      location: `${baseUrl}/login`,
    },
  }).as('logoutRequest');
};

export const interceptOpenidConfigurationRequest = () => {
  cy.intercept('GET', `${fusionAuthBaseUrl}/.well-known/openid-configuration`, {
    statusCode: 200,
    body: {
      authorization_endpoint: `${fusionAuthBaseUrl}/oauth2/authorize`,
      end_session_endpoint: `${fusionAuthBaseUrl}/oauth2/logout`,
    },
  }).as('openidConfigurationRequest');
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
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Company`, company, 'fetchCompanyRequest');
  });
};

export const interceptFetchCompanyFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/Company`, null, 'fetchCompanyFailedRequest', 404);
};

export const interceptFetchCompanyLicenseRequest = () => {
  cy.fixture('company-license').then((companyLicense) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/License/Company`, companyLicense, 'fetchCompanyLicenseRequest');
  });
};

export const interceptFetchCompanyLicenseFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/License/Company`, null, 'fetchCompanyLicenseFailedRequest', 404);
};

export const interceptUploadCompanyLicenseRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/License/Company`, null, 'uploadCompanyLicenseRequest');
};

export const interceptUploadCompanyLicenseFailedRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/License/Company`, null, 'uploadCompanyLicenseFailedRequest', 404);
};

export const interceptCreateCompanyRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Company`, null, 'createCompanyRequest');
};

export const interceptCreateCompanyFailedRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Company`, null, 'createCompanyFailedRequest', 404);
};

export const interceptFetchBranchesRequest = () => {
  cy.fixture('branches').then((branches) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Branches*`, branches, 'fetchBranchesRequest');
  });
};

export const interceptFetchBranchesFailedRequest = () => {
  cy.fixture('branches-empty').then((emptyBranches) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Branches*`, emptyBranches, 'fetchBranchesFailedRequest');
  });
};

export const interceptCreateBranchRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Branches`, null, 'createBranchRequest');
};

export const interceptCreateBranchFailedRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Branches`, null, 'createBranchFailedRequest', 404);
};

export const interceptFetchEmployeeRequest = () => {
  cy.fixture('employee').then((employee) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Employee`, employee, 'fetchEmployeeRequest');
  });
};

export const interceptFetchEmployeeFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/Employee`, null, 'fetchEmployeeFailedRequest', 404);
};

export const interceptCreateEmployeeRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Employee`, null, 'createEmployeeRequest');
};

export const interceptCreateEmployeeFailedRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Employee`, null, 'createEmployeeFailedRequest', 404);
};

export const interceptFetchEmployeesRequest = (delay = 300, pageNumber = 1, pageSize = 5) => {
  cy.fixture('employees').then((employees) => {
    cy.interceptWithAuth(
      'GET',
      `${serverBaseUrl}/Employees?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      employees,
      'fetchEmployeesRequest',
      200,
      delay
    );
  });
};

export const interceptFetchEmployeesFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/Employees*`, null, 'fetchEmployeesFailedRequest', 404);
};
