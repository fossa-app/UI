import { OnboardingStep, OnboardingStepOption } from 'shared/models';

export const COMPANY_ONBOARDING_STEPS: OnboardingStepOption[] = [
  { name: OnboardingStep.company, label: 'Create Company' },
  { name: OnboardingStep.companyLicense, label: 'Upload Company License' },
  { name: OnboardingStep.branch, label: 'Create Branch' },
];

export const EMPLOYEE_ONBOARDING_STEPS: OnboardingStepOption[] = [{ name: OnboardingStep.employee, label: 'Create Employee' }];
