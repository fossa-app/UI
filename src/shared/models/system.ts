export type EnvironmentKind = 'Development' | 'Staging' | 'Production';

export interface System {
  terms: {
    licensor: {
      longName: string;
      shortName: string;
    };
    licensee: {
      longName: string;
      shortName: string;
    };
  };
  entitlements: {
    environmentName: string;
    environmentKind: EnvironmentKind;
    maximumCompanyCount: number;
  };
}
