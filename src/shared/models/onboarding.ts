export enum OnboardingStep {
  company = 'company',
  branch = 'branch',
  companyLicense = 'companyLicense',
  employee = 'employee',
  completed = 'completed',
}

export type CompanyOnboardingStep =
  | OnboardingStep.company
  | OnboardingStep.companyLicense
  | OnboardingStep.branch
  | OnboardingStep.completed;

export interface OnboardingStepOption {
  name: OnboardingStep;
  label: string;
}
