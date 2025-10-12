export enum OnboardingStep {
  company = 'company',
  companySettings = 'companySettings',
  companyLicense = 'companyLicense',
  branch = 'branch',
  employee = 'employee',
  completed = 'completed',
}

export type CompanyOnboardingStep =
  | OnboardingStep.company
  | OnboardingStep.companySettings
  | OnboardingStep.companyLicense
  | OnboardingStep.branch
  | OnboardingStep.completed;

export interface OnboardingStepOption {
  name: OnboardingStep;
  label: string;
}
