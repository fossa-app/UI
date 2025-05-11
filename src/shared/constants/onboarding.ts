import { OnboardingStep, OnboardingStepOption } from 'shared/models';

export const COMPANY_ONBOARDING_STEPS: OnboardingStepOption[] = [
  { name: OnboardingStep.COMPANY, label: 'Create Company' },
  { name: OnboardingStep.BRANCH, label: 'Create Branch' },
];

export const EMPLOYEE_ONBOARDING_STEPS: OnboardingStepOption[] = [{ name: OnboardingStep.EMPLOYEE, label: 'Create Employee' }];
