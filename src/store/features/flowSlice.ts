import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { FlowsMap } from 'shared/models';
import { FLOWS_MAP } from 'shared/constants';
import { fetchCompany } from './companySlice';
import { fetchBranches } from './branchSlice';
import { fetchProfile } from './profileSlice';
import { fetchCompanyLicense } from './licenseSlice';

interface FlowState {
  flows: FlowsMap;
}

const initialState: FlowState = {
  flows: FLOWS_MAP,
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.rejected, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.flows.company!.subFlows!.viewCompany!.disabled = false;
        state.flows.profile!.subFlows!.employeeOnbarding!.disabled = false;
      })
      .addCase(fetchCompanyLicense.rejected, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = !!action.payload?.items?.length;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.flows.employees!.subFlows!.employees!.disabled = true;
        state.flows.branches!.subFlows!.branches!.disabled = true;
        state.flows.departments!.subFlows!.departments!.disabled = true;
        state.flows.profile!.subFlows!.employeeOnbarding!.disabled = false;
        state.flows.profile!.subFlows!.viewProfile!.disabled = true;
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.flows.employees!.subFlows!.employees!.disabled = false;
        state.flows.branches!.subFlows!.branches!.disabled = false;
        state.flows.departments!.subFlows!.departments!.disabled = false;
        state.flows.profile!.subFlows!.employeeOnbarding!.disabled = true;
        state.flows.profile!.subFlows!.viewProfile!.disabled = false;
      });
  },
});

export const selectFlows = (state: RootState) => state.flow.flows;

export default flowSlice.reducer;
