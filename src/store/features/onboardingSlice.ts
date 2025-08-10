import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import { CompanyOnboardingStep, ErrorResponseDTO, OnboardingStep } from 'shared/models';
import { deleteCompany, fetchCompany } from './companySlice';
import { fetchBranchesTotal } from './branchSlice';
import { deleteProfile, fetchProfile } from './profileSlice';
import { fetchCompanyLicense } from './licenseSlice';
import { fetchCompanySettings } from './companySettingsSlice';

interface OnboardingState {
  company: StateEntity<CompanyOnboardingStep> & {
    flags: {
      [OnboardingStep.company]: boolean;
      [OnboardingStep.companySettings]: boolean;
      [OnboardingStep.companyLicense]: boolean;
      [OnboardingStep.branch]: boolean;
    };
    skippedSteps: {
      [OnboardingStep.companyLicense]: boolean;
    };
  };
  employee: StateEntity<OnboardingStep> & {
    flags: {
      [OnboardingStep.employee]: boolean;
    };
  };
}

const initialState: OnboardingState = {
  company: {
    data: OnboardingStep.company,
    status: 'idle',
    flags: {
      [OnboardingStep.company]: false,
      [OnboardingStep.companySettings]: false,
      [OnboardingStep.companyLicense]: false,
      [OnboardingStep.branch]: false,
    },
    skippedSteps: {
      [OnboardingStep.companyLicense]: false,
    },
  },
  employee: {
    data: OnboardingStep.company,
    status: 'idle',
    flags: {
      [OnboardingStep.employee]: false,
    },
  },
};

const evaluateCompanyOnboardingStep = (state: WritableDraft<OnboardingState>) => {
  const { company, companySettings, companyLicense, branch } = state.company.flags;

  if (company && companySettings && companyLicense && branch) {
    state.company.data = OnboardingStep.completed;
    state.company.status = 'succeeded';
  } else if (company && companySettings && companyLicense) {
    state.company.data = OnboardingStep.branch;
    state.company.status = 'failed';
  } else if (company && companySettings) {
    state.company.data = OnboardingStep.companyLicense;
    state.company.status = 'failed';
  } else if (company) {
    state.company.data = OnboardingStep.companySettings;
    state.company.status = 'failed';
  } else {
    state.company.data = OnboardingStep.company;
    state.company.status = 'failed';
  }
};

const evaluateEmployeeOnboardingStep = (state: WritableDraft<OnboardingState>) => {
  const { employee } = state.employee.flags;

  if (employee) {
    state.employee.data = OnboardingStep.completed;
    state.employee.status = 'succeeded';
  } else {
    state.employee.data = OnboardingStep.employee;
    state.employee.status = 'failed';
  }
};

export const fetchOnboardingData = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'onboarding/fetchOnboardingData',
  async (_, { dispatch }) => {
    try {
      const companyResponse = await dispatch(fetchCompany(true)).unwrap();

      if (!companyResponse) {
        return;
      }

      try {
        await dispatch(fetchCompanyLicense()).unwrap();
      } catch {
        // We expect an error here
      }

      try {
        await dispatch(fetchCompanySettings()).unwrap();
      } catch {
        // We expect an error here
      }

      try {
        await dispatch(fetchBranchesTotal()).unwrap();
      } catch {
        // We expect an error here
      }

      try {
        await dispatch(fetchProfile()).unwrap();
      } catch {
        // We expect an error here
      }
    } catch {
      dispatch({ type: 'onboarding/setOnboardingFailed' });
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingFailed(state) {
      state.company.status = 'failed';
      state.employee.status = 'failed';
    },
    setCompanyLicenseSkipped(state) {
      state.company.skippedSteps[OnboardingStep.companyLicense] = true;
    },
    setBranchesFailedFlag(state) {
      state.company.flags[OnboardingStep.branch] = false;
      evaluateCompanyOnboardingStep(state);
    },
    setBranchesSucceededFlag(state) {
      state.company.flags[OnboardingStep.branch] = true;
      evaluateCompanyOnboardingStep(state);
    },
    resetCompanyLicenseSkipped(state) {
      state.company.skippedSteps[OnboardingStep.companyLicense] = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchCompanySettings.rejected, (state) => {
        state.company.flags[OnboardingStep.companySettings] = false;
        evaluateCompanyOnboardingStep(state);
      })
      .addCase(fetchCompanyLicense.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchBranchesTotal.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.employee.flags[OnboardingStep.employee] = false;
        evaluateEmployeeOnboardingStep(state);
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.flags[OnboardingStep.company] = true;
        evaluateCompanyOnboardingStep(state);
        state.employee.data = OnboardingStep.employee;
      })
      .addCase(fetchCompanySettings.fulfilled, (state) => {
        state.company.flags[OnboardingStep.companySettings] = true;
        evaluateCompanyOnboardingStep(state);
      })
      .addCase(fetchCompanyLicense.fulfilled, (state) => {
        state.company.flags[OnboardingStep.companyLicense] = true;
        evaluateCompanyOnboardingStep(state);
      })
      .addCase(fetchBranchesTotal.fulfilled, (state) => {
        state.company.flags[OnboardingStep.branch] = true;
        evaluateCompanyOnboardingStep(state);
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employee.flags[OnboardingStep.employee] = true;
        evaluateEmployeeOnboardingStep(state);
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.company.data = OnboardingStep.company;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.employee.data = OnboardingStep.employee;
      });
  },
});

export const selectCompanyOnboardingStep = (state: RootState) => state.onboarding.company;
export const selectCompanyOnboardingFlags = (state: RootState) => state.onboarding.company.flags;
export const selectCompanyOnboardingSkippedSteps = (state: RootState) => state.onboarding.company.skippedSteps;
export const selectEmployeeOnboardingStep = (state: RootState) => state.onboarding.employee;
export const selectOnboardingCompleted = (state: RootState) =>
  state.onboarding.company.data === OnboardingStep.completed && state.onboarding.employee.data === OnboardingStep.completed;

export const selectOnboardingLoading = (state: RootState) =>
  !['succeeded', 'failed'].includes(state.onboarding.company.status ?? '') ||
  !['succeeded', 'failed'].includes(state.onboarding.employee.status ?? '');

export const { setCompanyLicenseSkipped, resetCompanyLicenseSkipped, setBranchesFailedFlag, setBranchesSucceededFlag } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;
