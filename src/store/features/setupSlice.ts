import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import { ErrorResponse, SetupStep } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { fetchCompany } from './companySlice';
import { fetchBranches } from './branchSlice';
import { fetchEmployee } from './employeeSlice';

interface SetupState {
  step: StateEntity<SetupStep>;
}

const initialState: SetupState = {
  step: {
    data: SetupStep.COMPANY,
    status: 'idle',
  },
};

export const fetchSetupData = createAsyncThunk<void, void, { rejectValue: ErrorResponse }>(
  'setup/getSetupData',
  async (_, { dispatch }) => {
    const companyResponse = await dispatch(fetchCompany(true)).unwrap();

    if (companyResponse) {
      const branchesResponse = await dispatch(fetchBranches([APP_CONFIG.table.defaultPagination, true])).unwrap();

      if (branchesResponse?.items.length) {
        await dispatch(fetchEmployee()).unwrap();
      }
    }
  }
);

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state, action) => {
        if (action.meta.arg) {
          state.step.status = 'loading';
        }
      })
      .addCase(fetchCompany.rejected, (state) => {
        state.step.status = 'failed';
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.step.data = SetupStep.BRANCH;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.step.status = 'failed';
      })
      .addCase(fetchBranches.fulfilled, (state) => {
        state.step.data = SetupStep.EMPLOYEE;
      })
      .addCase(fetchEmployee.rejected, (state) => {
        state.step.status = 'failed';
        // TODO: monitor this step
        state.step.data = SetupStep.EMPLOYEE;
      })
      .addCase(fetchEmployee.fulfilled, (state) => {
        state.step.status = 'succeeded';
        state.step.data = SetupStep.COMPLETED;
      });
  },
});

export const selectStep = (state: RootState) => state.setup.step;

export default setupSlice.reducer;
