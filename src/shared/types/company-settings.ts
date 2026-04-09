import { ColorSchemeId } from 'shared/types';

export interface CompanySettings {
  id: number;
  companyId?: number;
  colorSchemeId?: ColorSchemeId;
}

export type CompanySettingsFieldConfig = {
  [K in keyof CompanySettings]: { field: K; name: string };
};
