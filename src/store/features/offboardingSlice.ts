import { createSlice } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import { OffboardingStep } from 'shared/models';
import { deleteCompany, fetchCompany } from './companySlice';
import { deleteProfile, fetchProfile } from './profileSlice';

interface OffboardingState {
  company: StateEntity<OffboardingStep>;
  employee: StateEntity<OffboardingStep>;
}

const initialState: OffboardingState = {
  company: {
    data: OffboardingStep.company,
    status: 'idle',
  },
  employee: {
    data: OffboardingStep.employee,
    status: 'idle',
  },
};

const offboardingSlice = createSlice({
  name: 'offboarding',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteCompany.rejected, (state) => {
        state.company.status = 'failed';
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.company.data = OffboardingStep.completed;
      })
      .addCase(deleteProfile.rejected, (state) => {
        state.employee.status = 'failed';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.employee.status = 'succeeded';
        state.employee.data = OffboardingStep.completed;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.data = OffboardingStep.company;
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employee.data = OffboardingStep.employee;
      });
  },
});

export const selectCompanyOffboardingStep = (state: RootState) => state.offboarding.company;
export const selectEmployeeOffboardingStep = (state: RootState) => state.offboarding.employee;

export default offboardingSlice.reducer;
