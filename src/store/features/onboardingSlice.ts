import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import { ErrorResponseDTO, OnboardingStep } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { fetchCompany } from './companySlice';
import { fetchBranches } from './branchSlice';
import { fetchProfile } from './profileSlice';

interface OnboardingState {
  company: StateEntity<OnboardingStep>;
  employee: StateEntity<OnboardingStep>;
}

const initialState: OnboardingState = {
  company: {
    data: OnboardingStep.COMPANY,
    status: 'idle',
  },
  employee: {
    data: OnboardingStep.COMPANY,
    status: 'idle',
  },
};

export const fetchOnboardingData = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'onboarding/fetchOnboardingData',
  async (_, { dispatch }) => {
    try {
      const companyResponse = await dispatch(fetchCompany(true)).unwrap();

      if (companyResponse) {
        try {
          await dispatch(fetchBranches([APP_CONFIG.table.defaultPagination, true])).unwrap();
        } catch (error) {
          console.log(error);
        }

        try {
          await dispatch(fetchProfile()).unwrap();
        } catch (error) {
          console.log(error);
        }
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
        state.company.data = OnboardingStep.BRANCH;
        state.employee.data = OnboardingStep.EMPLOYEE;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.company.status = 'succeeded';
        state.company.data = action.payload?.items?.length ? OnboardingStep.COMPLETED : OnboardingStep.BRANCH;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.employee.status = 'failed';
        state.employee.data = OnboardingStep.EMPLOYEE;
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employee.status = 'succeeded';
        state.employee.data = OnboardingStep.COMPLETED;
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
