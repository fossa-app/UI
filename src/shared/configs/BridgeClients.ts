import { HttpTransport_$ctor_3A0BE0FB } from '@fossa-app/bridge/Services/HttpTransport';
import { JsonSerializer_$ctor } from '@fossa-app/bridge/Services/JsonSerializer';
import { Clients_$ctor_Z7C557C0 } from '@fossa-app/bridge/Services/Clients';
import { IClients } from '@fossa-app/bridge/Services/IClients';

import { AppAccessTokenProvider, FetchHttpRequestSender } from './BridgeTransport';

// Initialize the shared Fable HttpTransport
const sender = new FetchHttpRequestSender();
const serializer = JsonSerializer_$ctor();
const tokenProvider = new AppAccessTokenProvider();

export const httpTransport = HttpTransport_$ctor_3A0BE0FB(sender, serializer, tokenProvider);

export const clients: IClients = Clients_$ctor_Z7C557C0(httpTransport);

// Export strongly typed Fable clients
export const branchClient = clients.BranchClient;
export const companyClient = clients.CompanyClient;
export const companySettingsClient = clients.CompanySettingsClient;
export const departmentClient = clients.DepartmentClient;
export const employeeClient = clients.EmployeeClient;
export const identityClient = clients.IdentityClient;
export const systemLicenseClient = clients.SystemLicenseClient;
export const companyLicenseClient = clients.CompanyLicenseClient;
