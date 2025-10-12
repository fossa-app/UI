import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { RootState, StateEntity, Status } from 'store';
import {
  fetchBranchesTotal,
  fetchCompanySettings,
  fetchCompany,
  fetchCompanyDatasourceTotals,
  fetchDepartmentsTotal,
  fetchEmployeesTotal,
  deleteProfile,
  fetchProfile,
} from 'store/thunks';
import {
  BranchDTO,
  CompanyDatasourceTotals,
  CompanyOffboardingStep,
  DepartmentDTO,
  EmployeeDTO,
  OffboardingStep,
  PaginatedResponse,
} from 'shared/types';

interface OffboardingState {
  company: StateEntity<CompanyOffboardingStep> & {
    flags: {
      [OffboardingStep.companySettings]: boolean;
      [OffboardingStep.instructions]: { status: Status } & CompanyDatasourceTotals;
      [OffboardingStep.company]: boolean;
    };
  };
  employee: StateEntity<OffboardingStep>;
}

const initialState: OffboardingState = {
  company: {
    item: OffboardingStep.companySettings,
    fetchStatus: 'idle',
    flags: {
      [OffboardingStep.companySettings]: false,
      [OffboardingStep.instructions]: {
        status: 'idle',
        branches: undefined,
        employees: undefined,
        departments: undefined,
      },
      [OffboardingStep.company]: false,
    },
  },
  employee: {
    item: OffboardingStep.employee,
    fetchStatus: 'idle',
  },
};

const evaluateCompanyOffboardingStep = (state: WritableDraft<OffboardingState>) => {
  const { companySettings, instructions, company } = state.company.flags;

  if (instructions.branches || instructions.employees || instructions.departments) {
    state.company.item = OffboardingStep.instructions;
    state.company.fetchStatus = 'failed';
  } else if (companySettings) {
    state.company.item = OffboardingStep.companySettings;
    state.company.fetchStatus = 'failed';
  } else if (company) {
    state.company.item = OffboardingStep.company;
    state.company.fetchStatus = 'failed';
  } else {
    state.company.item = OffboardingStep.completed;
    state.company.fetchStatus = 'succeeded';
  }
};

const offboardingSlice = createSlice({
  name: 'offboarding',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanySettings.rejected, (state) => {
        state.company.flags[OffboardingStep.companySettings] = false;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchBranchesTotal.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].branches = 0;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchEmployeesTotal.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].employees = 0;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchDepartmentsTotal.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].departments = 0;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchCompany.rejected, (state) => {
        state.company.flags[OffboardingStep.company] = false;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(deleteProfile.rejected, (state) => {
        state.employee.fetchStatus = 'failed';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.employee.fetchStatus = 'succeeded';
        state.employee.item = OffboardingStep.completed;
      })
      .addCase(fetchCompanySettings.fulfilled, (state) => {
        state.company.flags[OffboardingStep.companySettings] = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchBranchesTotal.fulfilled, (state, action: PayloadAction<PaginatedResponse<BranchDTO> | undefined>) => {
        state.company.flags[OffboardingStep.instructions].branches = action.payload?.totalItems;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employee.item = OffboardingStep.employee;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.flags[OffboardingStep.company] = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchEmployeesTotal.fulfilled, (state, action: PayloadAction<PaginatedResponse<EmployeeDTO> | undefined>) => {
        state.company.flags[OffboardingStep.instructions].employees = action.payload?.totalItems;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchDepartmentsTotal.fulfilled, (state, action: PayloadAction<PaginatedResponse<DepartmentDTO> | undefined>) => {
        state.company.flags[OffboardingStep.instructions].departments = action.payload?.totalItems;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchCompanyDatasourceTotals.pending, (state) => {
        state.company.flags[OffboardingStep.instructions].status = 'loading';
      })
      .addCase(fetchCompanyDatasourceTotals.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].status = 'failed';
      })
      .addCase(fetchCompanyDatasourceTotals.fulfilled, (state) => {
        state.company.flags[OffboardingStep.instructions].status = 'succeeded';
      });
  },
});

export const selectCompanyOffboardingStep = (state: RootState) => state.offboarding.company;
export const selectCompanyOffboardingInstructionsFlags = (state: RootState) =>
  state.offboarding.company.flags[OffboardingStep.instructions];
export const selectEmployeeOffboardingStep = (state: RootState) => state.offboarding.employee;

export default offboardingSlice.reducer;
