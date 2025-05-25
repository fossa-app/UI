import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import { ErrorResponseDTO, OnboardingStep } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { deleteCompany, fetchCompany } from './companySlice';
import { fetchBranches } from './branchSlice';
import { deleteProfile, fetchProfile } from './profileSlice';
import { fetchCompanyLicense } from './licenseSlice';

interface OnboardingState {
  company: StateEntity<OnboardingStep>;
  employee: StateEntity<OnboardingStep>;
}

const initialState: OnboardingState = {
  company: {
    data: OnboardingStep.company,
    status: 'idle',
  },
  employee: {
    data: OnboardingStep.company,
    status: 'idle',
  },
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
        await dispatch(fetchBranches([APP_CONFIG.table.defaultPagination, true])).unwrap();
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.data = OnboardingStep.companyLicense;
        state.employee.data = OnboardingStep.employee;
      })
      .addCase(fetchCompanyLicense.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchCompanyLicense.fulfilled, (state) => {
        state.company.data = OnboardingStep.branch;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.company.status = 'succeeded';
        state.company.data = action.payload?.items?.length ? OnboardingStep.completed : OnboardingStep.branch;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.employee.status = 'failed';
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
export const selectEmployeeOnboardingStep = (state: RootState) => state.onboarding.employee;
export const selectOnboardingCompleted = (state: RootState) =>
  state.onboarding.company.status === 'succeeded' && state.onboarding.employee.status === 'succeeded';
export const selectOnboardingLoading = (state: RootState) =>
  !['succeeded', 'failed'].includes(state.onboarding.company.status ?? '') ||
  !['succeeded', 'failed'].includes(state.onboarding.employee.status ?? '');

export default onboardingSlice.reducer;
