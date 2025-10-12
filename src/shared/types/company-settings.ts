import { ColorSchemeId } from 'shared/types';

export interface CompanySettingsDTO {
  id: number;
  companyId?: number;
  colorSchemeId?: ColorSchemeId;
}

export interface CompanySettings extends CompanySettingsDTO {}

export type CompanySettingsFieldConfig = {
  [K in keyof CompanySettings]: { field: K; name: string };
};
