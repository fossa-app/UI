import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import { CompanyOnboardingStep, ErrorResponseDTO, OnboardingStep } from 'shared/models';
import { deleteCompany, fetchCompany } from './companySlice';
import { fetchOnboardingBranches } from './branchSlice';
import { deleteProfile, fetchProfile } from './profileSlice';
import { fetchCompanyLicense } from './licenseSlice';

interface OnboardingState {
  company: StateEntity<CompanyOnboardingStep> & {
    flags: {
      [OnboardingStep.company]: boolean;
      [OnboardingStep.companyLicense]: boolean;
      [OnboardingStep.branch]: boolean;
    };
  };
  employee: StateEntity<OnboardingStep>;
}

const initialState: OnboardingState = {
  company: {
    data: OnboardingStep.company,
    status: 'idle',
    flags: {
      [OnboardingStep.company]: false,
      [OnboardingStep.companyLicense]: false,
      [OnboardingStep.branch]: false,
    },
  },
  employee: {
    data: OnboardingStep.company,
    status: 'idle',
  },
};

const evaluateCompanyOnboardingStep = (state: WritableDraft<OnboardingState>) => {
  const { company, companyLicense, branch } = state.company.flags;

  if (company && companyLicense && branch) {
    state.company.data = OnboardingStep.completed;
    state.company.status = 'succeeded';
  } else if (company && companyLicense) {
    state.company.data = OnboardingStep.branch;
    state.company.status = 'failed';
  } else if (company) {
    state.company.data = OnboardingStep.companyLicense;
    state.company.status = 'failed';
  } else {
    state.company.data = OnboardingStep.company;
    state.company.status = 'failed';
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
      } catch (error) {
        console.error('Failed to fetch company license:', error);
      }

      try {
        await dispatch(fetchOnboardingBranches()).unwrap();
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      }

      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
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
      state.company.flags[OnboardingStep.companyLicense] = true;
      evaluateCompanyOnboardingStep(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchCompanyLicense.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchOnboardingBranches.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.employee.status = 'failed';
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.flags[OnboardingStep.company] = true;
        evaluateCompanyOnboardingStep(state);
        state.employee.data = OnboardingStep.employee;
      })
      .addCase(fetchCompanyLicense.fulfilled, (state) => {
        state.company.flags[OnboardingStep.companyLicense] = true;
        evaluateCompanyOnboardingStep(state);
      })
      .addCase(fetchOnboardingBranches.fulfilled, (state) => {
        state.company.flags[OnboardingStep.branch] = true;
        evaluateCompanyOnboardingStep(state);
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employee.status = 'succeeded';
        state.employee.data = OnboardingStep.completed;
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
export const selectEmployeeOnboardingStep = (state: RootState) => state.onboarding.employee;
export const selectOnboardingCompleted = (state: RootState) =>
  state.onboarding.company.data === OnboardingStep.completed && state.onboarding.employee.data === OnboardingStep.completed;

export const selectOnboardingLoading = (state: RootState) =>
  !['succeeded', 'failed'].includes(state.onboarding.company.status ?? '') ||
  !['succeeded', 'failed'].includes(state.onboarding.employee.status ?? '');

export const { setCompanyLicenseSkipped } = onboardingSlice.actions;

export default onboardingSlice.reducer;
