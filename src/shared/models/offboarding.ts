export enum OffboardingStep {
  instructions = 'instructions',
  companySettings = 'companySettings',
  company = 'company',
  employee = 'employee',
  completed = 'completed',
}

export type CompanyOffboardingStep =
  | OffboardingStep.instructions
  | OffboardingStep.companySettings
  | OffboardingStep.company
  | OffboardingStep.completed;

export interface OffboardingStepOption {
  name: OffboardingStep;
  label: string;
}
