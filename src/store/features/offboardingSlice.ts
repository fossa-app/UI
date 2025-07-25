import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import {
  BranchDTO,
  CompanyOffboardingStep,
  DepartmentDTO,
  EmployeeDTO,
  ErrorResponseDTO,
  OffboardingStep,
  PaginatedResponse,
  Status,
} from 'shared/models';
import { fetchOnboardingBranches } from './branchSlice';
import { fetchCompanySettings } from './companySettingsSlice';
import { fetchCompany } from './companySlice';
import { deleteProfile, fetchProfile } from './profileSlice';
import { fetchOnboardingDepartments } from './departmentSlice';
import { fetchOnboardingEmployees } from './employeeSlice';

interface OffboardingState {
  company: StateEntity<CompanyOffboardingStep> & {
    flags: {
      [OffboardingStep.companySettings]: boolean;
      [OffboardingStep.instructions]: {
        status: Status;
        branches?: number;
        employees?: number;
        departments?: number;
      };
      [OffboardingStep.company]: boolean;
    };
  };
  employee: StateEntity<OffboardingStep>;
}

const initialState: OffboardingState = {
  company: {
    data: OffboardingStep.companySettings,
    status: 'idle',
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
    data: OffboardingStep.employee,
    status: 'idle',
  },
};

const evaluateCompanyOffboardingStep = (state: WritableDraft<OffboardingState>) => {
  const { companySettings, instructions, company } = state.company.flags;

  if (instructions.branches || instructions.employees || instructions.departments) {
    state.company.data = OffboardingStep.instructions;
    state.company.status = 'failed';
  } else if (companySettings) {
    state.company.data = OffboardingStep.companySettings;
    state.company.status = 'failed';
  } else if (company) {
    state.company.data = OffboardingStep.company;
    state.company.status = 'failed';
  } else {
    state.company.data = OffboardingStep.completed;
    state.company.status = 'succeeded';
  }
};

export const fetchOffboardingData = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'offboarding/fetchOffboardingData',
  async (_, { dispatch }) => {
    try {
      await dispatch(fetchOnboardingBranches()).unwrap();
    } catch {
      // We expect an error here
    }

    try {
      await dispatch(fetchOnboardingEmployees()).unwrap();
    } catch {
      // We expect an error here
    }

    try {
      await dispatch(fetchOnboardingDepartments()).unwrap();
    } catch {
      // We expect an error here
    }
  }
);

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
      .addCase(fetchOnboardingBranches.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].branches = 0;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingEmployees.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].employees = 0;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingDepartments.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].departments = 0;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchCompany.rejected, (state) => {
        state.company.flags[OffboardingStep.company] = false;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(deleteProfile.rejected, (state) => {
        state.employee.status = 'failed';
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.employee.status = 'succeeded';
        state.employee.data = OffboardingStep.completed;
      })
      .addCase(fetchCompanySettings.fulfilled, (state) => {
        state.company.flags[OffboardingStep.companySettings] = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<BranchDTO> | undefined>) => {
        state.company.flags[OffboardingStep.instructions].branches = action.payload?.totalItems;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchProfile.fulfilled, (state) => {
        state.employee.data = OffboardingStep.employee;
      })
      .addCase(fetchCompany.fulfilled, (state) => {
        state.company.flags[OffboardingStep.company] = true;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingEmployees.fulfilled, (state, action: PayloadAction<PaginatedResponse<EmployeeDTO> | undefined>) => {
        state.company.flags[OffboardingStep.instructions].employees = action.payload?.totalItems;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOnboardingDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<DepartmentDTO> | undefined>) => {
        state.company.flags[OffboardingStep.instructions].departments = action.payload?.totalItems;
        evaluateCompanyOffboardingStep(state);
      })
      .addCase(fetchOffboardingData.pending, (state) => {
        state.company.flags[OffboardingStep.instructions].status = 'loading';
      })
      .addCase(fetchOffboardingData.rejected, (state) => {
        state.company.flags[OffboardingStep.instructions].status = 'failed';
      })
      .addCase(fetchOffboardingData.fulfilled, (state) => {
        state.company.flags[OffboardingStep.instructions].status = 'succeeded';
      });
  },
});

export const selectCompanyOffboardingStep = (state: RootState) => state.offboarding.company;
export const selectCompanyOffboardingInstructionsFlags = (state: RootState) =>
  state.offboarding.company.flags[OffboardingStep.instructions];
export const selectEmployeeOffboardingStep = (state: RootState) => state.offboarding.employee;

export default offboardingSlice.reducer;
