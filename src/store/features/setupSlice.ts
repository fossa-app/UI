import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import { ErrorResponseDTO, SetupStep } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { fetchCompany } from './companySlice';
import { fetchBranches } from './branchSlice';
import { fetchProfile } from './profileSlice';

interface SetupState {
  companyOnboarding: StateEntity<SetupStep>;
  employeeOnboarding: StateEntity<SetupStep>;
}

const initialState: SetupState = {
  companyOnboarding: {
    data: SetupStep.COMPANY,
    status: 'idle',
  },
  employeeOnboarding: {
    data: SetupStep.COMPANY,
    status: 'idle',
  },
};

export const fetchSetupData = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'setup/fetchSetupData',
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
      dispatch({ type: 'setup/setOnboardingFailed' });
    }
  }
);

// TODO: rename to onboardingSlice
const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    setOnboardingFailed(state) {
      state.companyOnboarding.status = 'failed';
      state.employeeOnboarding.status = 'failed';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.rejected, (state) => {
        state.companyOnboarding.status = 'failed';
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.companyOnboarding.data = SetupStep.BRANCH;
        state.employeeOnboarding.data = SetupStep.EMPLOYEE;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.companyOnboarding.status = 'failed';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.companyOnboarding.status = 'succeeded';
        state.companyOnboarding.data = action.payload?.items?.length ? SetupStep.COMPLETED : SetupStep.BRANCH;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.employeeOnboarding.status = 'failed';
        state.employeeOnboarding.data = SetupStep.EMPLOYEE;
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employeeOnboarding.status = 'succeeded';
        state.employeeOnboarding.data = SetupStep.COMPLETED;
      });
  },
});

export const selectCompanyOnboardingStep = (state: RootState) => state.setup.companyOnboarding;
export const selectEmployeeOnboardingStep = (state: RootState) => state.setup.employeeOnboarding;
export const selectOnboardingCompleted = (state: RootState) =>
  state.setup.companyOnboarding.status === 'succeeded' && state.setup.employeeOnboarding.status === 'succeeded';
export const selectSetupLoading = (state: RootState) =>
  !['succeeded', 'failed'].includes(state.setup.companyOnboarding.status ?? '') ||
  !['succeeded', 'failed'].includes(state.setup.employeeOnboarding.status ?? '');

export default setupSlice.reducer;
