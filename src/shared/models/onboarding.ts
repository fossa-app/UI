export enum OnboardingStep {
  company = 'company',
  branch = 'branch',
  companyLicense = 'companyLicense',
  employee = 'employee',
  completed = 'completed',
}

export interface OnboardingStepOption {
  name: OnboardingStep;
  label: string;
}
