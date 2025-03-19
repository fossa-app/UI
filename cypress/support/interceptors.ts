import { Branch, Employee, PaginatedResponse } from 'shared/models';

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

export const interceptFetchCompanyRequest = (alias = 'fetchCompanyRequest', fixture = 'company') => {
  cy.fixture(fixture).then((company) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Company`, company, alias);
  });
};

export const interceptFetchCompanyFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/Company`, null, 'fetchCompanyFailedRequest', 404);
};

export const interceptEditCompanyRequest = () => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Company`, null, 'editCompanyRequest');
};

export const interceptEditCompanyFailedRequest = () => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Company`, null, 'editCompanyFailedRequest', 404);
};

export const interceptEditCompanyFailedWithErrorRequest = (alias = 'editCompanyFailedWithErrorRequest', fixture = 'company-error') => {
  cy.fixture(fixture).then((companyError) => {
    cy.interceptWithAuth('PUT', `${serverBaseUrl}/Company`, companyError, alias, 422);
  });
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

export const interceptCreateCompanyFailedWithErrorRequest = (alias = 'createCompanyFailedWithErrorRequest', fixture = 'company-error') => {
  cy.fixture(fixture).then((companyError) => {
    cy.interceptWithAuth('POST', `${serverBaseUrl}/Company`, companyError, alias, 422);
  });
};

export const interceptFetchBranchesRequest = (
  { pageNumber = 1, pageSize = 10, search = '' } = {},
  { alias = 'fetchBranchesRequest', fixture = 'branches', statusCode = 200, delay = 300 } = {}
) => {
  cy.fixture(fixture).then((branches) => {
    const searchParam = search ? `&search=${search}` : '';
    const url = `${serverBaseUrl}/Branches?pageNumber=${pageNumber}&pageSize=${pageSize}${searchParam}`;

    cy.interceptWithAuth('GET', url, branches, alias, statusCode, delay);
  });
};

export const interceptFetchBranchesFailedRequest = () => {
  cy.fixture('branches-empty').then((emptyBranches) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Branches*`, emptyBranches, 'fetchBranchesFailedRequest');
  });
};

export const interceptFetchBranchesByIdsRequest = (
  { ids }: { ids: number[] },
  { alias = 'fetchBranchesByIdsRequest', fixture = 'branches', statusCode = 200, delay = 300 } = {}
) => {
  cy.fixture(fixture).then((branches) => {
    const queryString = ids.map((id) => `id=${id}`).join('&');
    const url = `${serverBaseUrl}/Branches?${queryString}`;

    cy.interceptWithAuth('GET', url, branches, alias, statusCode, delay);
  });
};

export const interceptFetchBranchByIdRequest = (
  id: string,
  alias = 'fetchBranchByIdRequest',
  fixture = 'branches',
  statusCode = 200,
  delay = 300
) => {
  cy.fixture(fixture).then((branches: PaginatedResponse<Branch>) => {
    const response = branches.items.find((branch) => String(branch.id) === id);

    cy.interceptWithAuth('GET', `${serverBaseUrl}/Branches/${id}`, response, alias, statusCode, delay);
  });
};

export const interceptFetchBranchByIdFailedRequest = (id: string) => {
  cy.fixture('branches').then((branches: PaginatedResponse<Branch>) => {
    cy.interceptWithAuth(
      'GET',
      `${serverBaseUrl}/Branches/${id}`,
      branches.items.find((branch) => String(branch.id) === id),
      'fetchBranchByIdFailedRequest',
      404
    );
  });
};

export const interceptCreateBranchRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Branches`, null, 'createBranchRequest');
};

export const interceptCreateBranchFailedRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Branches`, null, 'createBranchFailedRequest', 404);
};

export const interceptCreateBranchFailedWithErrorRequest = (alias = 'createBranchFailedWithErrorRequest', fixture = 'branch-error') => {
  cy.fixture(fixture).then((branchError) => {
    cy.interceptWithAuth('POST', `${serverBaseUrl}/Branches`, branchError, alias, 422);
  });
};

export const interceptEditBranchRequest = (id: string) => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Branches/${id}`, null, 'editBranchRequest');
};

export const interceptEditBranchFailedRequest = (id: string) => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Branches/${id}`, null, 'editBranchFailedRequest', 404);
};

export const interceptEditBranchFailedWithErrorRequest = (
  id: string,
  alias = 'editBranchFailedWithErrorRequest',
  fixture = 'branch-error'
) => {
  cy.fixture(fixture).then((branchError) => {
    cy.interceptWithAuth('PUT', `${serverBaseUrl}/Branches/${id}`, branchError, alias, 422);
  });
};

export const interceptDeleteBranchRequest = (id: string) => {
  cy.interceptWithAuth('DELETE', `${serverBaseUrl}/Branches/${id}`, null, 'deleteBranchRequest');
};

export const interceptDeleteBranchFailedRequest = (id: string) => {
  cy.interceptWithAuth('DELETE', `${serverBaseUrl}/Branches/${id}`, null, 'deleteBranchFailedRequest', 404);
};

export const interceptFetchProfileRequest = (alias = 'fetchProfileRequest', fixture = 'employee') => {
  cy.fixture(fixture).then((employee) => {
    cy.interceptWithAuth('GET', `${serverBaseUrl}/Employee`, employee, alias);
  });
};

export const interceptFetchProfileFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/Employee`, null, 'fetchProfileFailedRequest', 404);
};

export const interceptCreateProfileRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Employee`, null, 'createProfileRequest');
};

export const interceptCreateProfileFailedRequest = () => {
  cy.interceptWithAuth('POST', `${serverBaseUrl}/Employee`, null, 'createProfileFailedRequest', 404);
};

export const interceptCreateProfileFailedWithErrorRequest = (alias = 'createProfileFailedWithErrorRequest', fixture = 'profile-error') => {
  cy.fixture(fixture).then((profileError) => {
    cy.interceptWithAuth('POST', `${serverBaseUrl}/Employee`, profileError, alias, 422);
  });
};

export const interceptEditProfileRequest = () => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Employee`, null, 'editProfileRequest');
};

export const interceptEditProfileFailedRequest = () => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Employee`, null, 'editProfileFailedRequest', 404);
};

export const interceptEditProfileFailedWithErrorRequest = (alias = 'editProfileFailedWithErrorRequest', fixture = 'profile-error') => {
  cy.fixture(fixture).then((profileError) => {
    cy.interceptWithAuth('PUT', `${serverBaseUrl}/Employee`, profileError, alias, 422);
  });
};

export const interceptFetchEmployeesRequest = (
  { pageNumber = 1, pageSize = 10, search = '' } = {},
  { alias = 'fetchEmployeesRequest', fixture = 'employees', statusCode = 200, delay = 300 } = {}
) => {
  cy.fixture(fixture).then((employees) => {
    const searchParam = search ? `&search=${search}` : '';
    const url = `${serverBaseUrl}/Employees?pageNumber=${pageNumber}&pageSize=${pageSize}${searchParam}`;

    cy.interceptWithAuth('GET', url, employees, alias, statusCode, delay);
  });
};

export const interceptFetchEmployeesFailedRequest = () => {
  cy.interceptWithAuth('GET', `${serverBaseUrl}/Employees*`, null, 'fetchEmployeesFailedRequest', 404);
};

export const interceptFetchEmployeeByIdRequest = (
  id: string,
  alias = 'fetchEmployeeByIdRequest',
  fixture = 'employees',
  statusCode = 200,
  delay = 300
) => {
  cy.fixture(fixture).then((employees: PaginatedResponse<Employee>) => {
    const response = employees.items.find((employee) => String(employee.id) === id);

    cy.interceptWithAuth('GET', `${serverBaseUrl}/Employees/${id}`, response, alias, statusCode, delay);
  });
};

export const interceptFetchEmployeeByIdFailedRequest = (id: string) => {
  cy.fixture('employees').then((employees: PaginatedResponse<Employee>) => {
    cy.interceptWithAuth(
      'GET',
      `${serverBaseUrl}/Employees/${id}`,
      employees.items.find((employee) => String(employee.id) === id),
      'fetchEmployeeByIdFailedRequest',
      404
    );
  });
};

export const interceptEditEmployeeRequest = (id: string) => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Employees/${id}`, null, 'editEmployeeRequest');
};

export const interceptEditEmployeeFailedRequest = (id: string) => {
  cy.interceptWithAuth('PUT', `${serverBaseUrl}/Employees/${id}`, null, 'editEmployeeFailedRequest', 404);
};

export const interceptEditEmployeeFailedWithErrorRequest = (
  id: string,
  alias = 'editEmployeeFailedWithErrorRequest',
  fixture = 'employee-error'
) => {
  cy.fixture(fixture).then((employeeError) => {
    cy.interceptWithAuth('PUT', `${serverBaseUrl}/Employees/${id}`, employeeError, alias, 422);
  });
};
