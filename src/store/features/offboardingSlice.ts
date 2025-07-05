import { createSlice } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import { CompanyOffboardingStep, OffboardingStep } from 'shared/models';
import { fetchOnboardingBranches } from './branchSlice';
import { fetchCompanySettings } from './companySettingsSlice';
import { fetchCompany } from './companySlice';
import { deleteProfile, fetchProfile } from './profileSlice';

interface OffboardingState {
  company: StateEntity<CompanyOffboardingStep> & {
    flags: {
      [OffboardingStep.companySettings]: boolean;
      [OffboardingStep.instructions]: {
        branch: boolean;
        employee: boolean;
      };
      [OffboardingStep.company]: boolean;
    };
  };
  employee: StateEntity<OffboardingStep>;
}

const initialState: OffboardingState = {
  company: {
    data: OffboardingStep.companySettings,
    status: 'idle',
    flags: {
      [OffboardingStep.companySettings]: false,
      [OffboardingStep.instructions]: { branch: false, employee: false },
      [OffboardingStep.company]: false,
    },
  },
  employee: {
    data: OffboardingStep.employee,
    status: 'idle',
  },
};

const evaluateCompanyOffboardingStep = (state: WritableDraft<OffboardingState>) => {
  const { companySettings, instructions, company } = state.company.flags;

  if (!companySettings) {
    state.company.data = OffboardingStep.companySettings;
    state.company.status = 'failed';
  } else if (!instructions.branch || !instructions.employee) {
    state.company.data = OffboardingStep.instructions;
    state.company.status = 'failed';
  } else if (!company) {
    state.company.data = OffboardingStep.company;
    state.company.status = 'failed';
  } else {
    state.company.data = OffboardingStep.completed;
    state.company.status = 'succeeded';
  }
};

const offboardingSlice = createSlice({
  name: 'offboarding',
  initialState,
  reducers: {
    setBranchInstructionsCompleted(state) {
      state.company.flags[OffboardingStep.instructions].branch = true;
      evaluateCompanyOffboardingStep(state);
    },
    setEmployeeInstructionsCompleted(state) {
      state.company.flags[OffboardingStep.instructions].employee = true;
      evaluateCompanyOffboardingStep(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanySettings.rejected, (state) => {
        state.company.flags[OffboardingStep.companySettings] = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingBranches.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].branch = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].employee = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchCompany.rejected, (state) => {
        state.company.flags[OffboardingStep.company] = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(deleteProfile.rejected, (state) => {
        state.employee.status = 'failed';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.employee.status = 'succeeded';
        state.employee.data = OffboardingStep.completed;
      })
      .addCase(fetchCompanySettings.fulfilled, (state) => {
        state.company.flags[OffboardingStep.companySettings] = false;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingBranches.fulfilled, (state) => {
        state.company.flags[OffboardingStep.instructions].branch = false;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.company.flags[OffboardingStep.instructions].employee = false;
        state.employee.data = OffboardingStep.employee;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.flags[OffboardingStep.company] = false;
        evaluateCompanyOffboardingStep(state);
      });
  },
});

export const selectCompanyOffboardingStep = (state: RootState) => state.offboarding.company;
export const selectEmployeeOffboardingStep = (state: RootState) => state.offboarding.employee;

export const { setBranchInstructionsCompleted, setEmployeeInstructionsCompleted } = offboardingSlice.actions;

export default offboardingSlice.reducer;
