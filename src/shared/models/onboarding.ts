export enum OnboardingStep {
  COMPANY = 'company',
  BRANCH = 'branch',
  EMPLOYEE = 'employee',
  COMPLETED = 'completed',
}

export interface OnboardingStepOption {
  name: OnboardingStep;
  label: string;
}
