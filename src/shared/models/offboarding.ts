export enum OffboardingStep {
  companySettings = 'companySettings',
  instructions = 'instructions',
  company = 'company',
  employee = 'employee',
  completed = 'completed',
}

export type CompanyOffboardingStep =
  | OffboardingStep.companySettings
  | OffboardingStep.instructions
  | OffboardingStep.company
  | OffboardingStep.completed;

export interface OffboardingStepOption {
  name: OffboardingStep;
  label: string;
}
