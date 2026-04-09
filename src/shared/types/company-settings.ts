import type { CompanySettingsRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import type { BridgeViewModel } from './common';
import type { ColorSchemeId } from './theme';

type BridgeCompanySettings = BridgeViewModel<CompanySettingsRetrievalModel>;

export type CompanySettings = Omit<BridgeCompanySettings, 'companyId' | 'colorSchemeId'> & {
  companyId?: number;
  colorSchemeId?: ColorSchemeId;
};

export type CompanySettingsFieldConfig = {
  [K in keyof CompanySettings]: { field: K; name: string };
};
