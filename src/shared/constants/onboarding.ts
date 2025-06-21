import { RouteItem, OnboardingStep, OnboardingStepOption, CompanyOnboardingStep } from 'shared/models';
import { ROUTES } from './routes';

export const COMPANY_ONBOARDING_STEPS: OnboardingStepOption[] = [
  { name: OnboardingStep.company, label: 'Create Company' },
  { name: OnboardingStep.companyLicense, label: 'Upload Company License' },
  { name: OnboardingStep.branch, label: 'Create Branch' },
];

export const COMPANY_ONBOARDING_STEP_MAP: Record<CompanyOnboardingStep, RouteItem> = {
  [OnboardingStep.company]: {
    name: ROUTES.createCompany.name,
    path: ROUTES.createCompany.path,
  },
  [OnboardingStep.companyLicense]: {
    name: ROUTES.uploadCompanyLicense.name,
    path: ROUTES.uploadCompanyLicense.path,
  },
  [OnboardingStep.branch]: {
    name: ROUTES.createBranch.name,
    path: ROUTES.createBranch.path,
  },
  [OnboardingStep.completed]: {
    name: ROUTES.flows.name,
    path: ROUTES.flows.path,
  },
};

export const EMPLOYEE_ONBOARDING_STEPS: OnboardingStepOption[] = [{ name: OnboardingStep.employee, label: 'Create Employee' }];
