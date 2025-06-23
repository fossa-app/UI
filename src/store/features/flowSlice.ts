import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { FlowsMap, OnboardingStep } from 'shared/models';
import { FLOWS_MAP } from 'shared/constants';
import { deleteCompany, fetchCompany } from './companySlice';
import { fetchOnboardingBranches } from './branchSlice';
import { deleteProfile, fetchProfile } from './profileSlice';
import { fetchCompanyLicense } from './licenseSlice';

interface FlowState {
  flows: FlowsMap;
  flags: {
    [OnboardingStep.company]: boolean;
    [OnboardingStep.companyLicense]: boolean;
    [OnboardingStep.branch]: boolean;
  };
}

const initialState: FlowState = {
  flows: FLOWS_MAP,
  flags: {
    [OnboardingStep.company]: false,
    [OnboardingStep.companyLicense]: false,
    [OnboardingStep.branch]: false,
  },
};

const checkAllFlagsSet = (flags: FlowState['flags']) =>
  flags[OnboardingStep.company] && flags[OnboardingStep.companyLicense] && flags[OnboardingStep.branch];

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.rejected, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
      })
      .addCase(fetchCompanyLicense.rejected, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
      })
      .addCase(fetchOnboardingBranches.rejected, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.flags[OnboardingStep.company] = true;
        state.flows.company!.subFlows!.viewCompany!.disabled = false;
        state.flows.profile!.subFlows!.employeeOnboarding!.disabled = false;
        state.flows.company!.subFlows!.companySettings!.disabled = false;
        state.flows.company!.subFlows!.companyOffboarding!.disabled = false;
        state.flows.company!.subFlows!.companyOnboarding!.disabled = checkAllFlagsSet(state.flags);
      })
      .addCase(fetchCompanyLicense.fulfilled, (state) => {
        state.flags[OnboardingStep.companyLicense] = true;
        state.flows.company!.subFlows!.companyOnboarding!.disabled = checkAllFlagsSet(state.flags);
      })
      .addCase(fetchOnboardingBranches.fulfilled, (state, action) => {
        state.flags[OnboardingStep.branch] = true;
        state.flows.company!.subFlows!.companyOnboarding!.disabled = !!action.payload?.items?.length && checkAllFlagsSet(state.flags);
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.flows.employees!.subFlows!.employees!.disabled = true;
        state.flows.branches!.subFlows!.branches!.disabled = true;
        state.flows.departments!.subFlows!.departments!.disabled = true;
        state.flows.profile!.subFlows!.employeeOnboarding!.disabled = false;
        state.flows.profile!.subFlows!.viewProfile!.disabled = true;
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.flows.employees!.subFlows!.employees!.disabled = false;
        state.flows.branches!.subFlows!.branches!.disabled = false;
        state.flows.departments!.subFlows!.departments!.disabled = false;
        state.flows.profile!.subFlows!.employeeOnboarding!.disabled = true;
        state.flows.profile!.subFlows!.employeeOffboarding!.disabled = false;
        state.flows.profile!.subFlows!.viewProfile!.disabled = false;
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.flows.company!.subFlows!.companyOnboarding!.disabled = false;
        state.flows.company!.subFlows!.companyOffboarding!.disabled = true;
        state.flows.company!.subFlows!.viewCompany!.disabled = true;
        state.flows.company!.subFlows!.companySettings!.disabled = true;
        state.flows.profile!.subFlows!.employeeOnboarding!.disabled = true;
        state.flows.profile!.subFlows!.viewProfile!.disabled = true;
        state.flows.profile!.subFlows!.employeeOffboarding!.disabled = true;
        state.flows.employees!.subFlows!.employees!.disabled = true;
        state.flows.branches!.subFlows!.branches!.disabled = true;
        state.flows.departments!.subFlows!.departments!.disabled = true;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.flows.profile!.subFlows!.employeeOnboarding!.disabled = false;
        state.flows.profile!.subFlows!.employeeOffboarding!.disabled = true;
        state.flows.profile!.subFlows!.viewProfile!.disabled = true;
        state.flows.employees!.subFlows!.employees!.disabled = true;
        state.flows.branches!.subFlows!.branches!.disabled = true;
        state.flows.departments!.subFlows!.departments!.disabled = true;
      });
  },
});

export const selectFlows = (state: RootState) => state.flow.flows;

export default flowSlice.reducer;
