import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { FlowsMap } from 'shared/models';
import { FLOWS_MAP } from 'shared/constants';
import { fetchCompany } from './companySlice';
import { fetchBranches } from './branchSlice';
import { fetchProfile } from './profileSlice';

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
        state.flows.company!.subFlows!.setCompany!.disabled = false;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.flows.company!.subFlows!.setCompany!.disabled = true;
        state.flows.company!.subFlows!.viewCompany!.disabled = false;
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.flows.branches!.subFlows!.setBranch!.disabled = false;
      })
      .addCase(fetchBranches.fulfilled, (state) => {
        state.flows.branches!.subFlows!.setBranch!.disabled = true;
        state.flows.branches!.subFlows!.branches!.disabled = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.flows.profile!.subFlows!.setEmployee!.disabled = false;
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.flows.profile!.subFlows!.setEmployee!.disabled = true;
        state.flows.profile!.subFlows!.viewProfile!.disabled = false;
      });
  },
});

export const selectFlows = (state: RootState) => state.flow.flows;

export default flowSlice.reducer;
