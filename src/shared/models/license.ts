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
}

export interface CompanyLicense extends License {
  entitlements: {
    companyId: number;
    maximumBranchCount: number;
    maximumEmployeeCount: number;
  };
}
export interface SystemLicense extends License {
  entitlements: {
    environmentName: string;
    environmentKind: EnvironmentKind;
    maximumCompanyCount: number;
  };
}
