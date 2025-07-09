import { RouteItem } from 'shared/models';
import { CompanyOffboardingStep, OffboardingStep, OffboardingStepOption } from '../models/offboarding';
import { ROUTES } from './routes';

export const COMPANY_OFFBOARDING_STEPS: OffboardingStepOption[] = [
  { name: OffboardingStep.instructions, label: 'Delete Branches, Departments & Offboard Employees' },
  { name: OffboardingStep.companySettings, label: 'Delete Company Settings' },
  { name: OffboardingStep.company, label: 'Delete Company' },
];

export const COMPANY_OFFBOARDING_STEP_MAP: Record<CompanyOffboardingStep, RouteItem> = {
  [OffboardingStep.instructions]: {
    name: ROUTES.companyOffboardingInstructions.name,
    path: ROUTES.companyOffboardingInstructions.path,
  },
  [OffboardingStep.companySettings]: {
    name: ROUTES.deleteCompanySettings.name,
    path: ROUTES.deleteCompanySettings.path,
  },
  [OffboardingStep.company]: {
    name: ROUTES.deleteCompany.name,
    path: ROUTES.deleteCompany.path,
  },
  [OffboardingStep.completed]: {
    name: ROUTES.flows.name,
    path: ROUTES.flows.path,
  },
};
