export type EnvironmentKind = 'Development' | 'Staging' | 'Production';

export interface License {
  terms: {
    licensor: {
      longName: string;
      shortName: string;
    };
    licensee: {
      longName: string;
      shortName: string;
    };
    notBefore: string;
    notAfter: string;
  };
  entitlements: {
    environmentName: string;
    environmentKind: EnvironmentKind;
    maximumCompanyCount: number;
  };
}

export interface CompanyLicense extends License {}
export interface SystemLicense extends License {}
