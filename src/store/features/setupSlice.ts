import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'store';
import axios from 'shared/configs/axios.config';
import {
  Branch,
  Company,
  Employee,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  SetupStep,
  StateEntity,
  Status,
} from 'shared/models';
import { URLS } from 'shared/constants';

interface SetupState {
  company: StateEntity<Company | null>;
  branches: StateEntity<PaginatedResponse<Branch> | null>;
  employee: StateEntity<Employee | null>;
  step: SetupStep;
  status: Status;
}

const initialState: SetupState = {
  company: {
    data: null,
    status: 'idle',
  },
  branches: {
    data: null,
    status: 'idle',
  },
  employee: {
    data: null,
    status: 'idle',
  },
  status: 'idle',
  step: SetupStep.COMPANY,
};

export const fetchSetupData = createAsyncThunk<void, void, { rejectValue: ErrorResponse }>(
  'setup/getSetupData',
  async (_, { dispatch }) => {
    const companyResponse = await dispatch(fetchCompany()).unwrap();

    if (companyResponse) {
      const branchesResponse = await dispatch(fetchBranches({ pageNumber: 1, pageSize: 1 })).unwrap();

      if (branchesResponse?.items.length) {
        await dispatch(fetchEmployee()).unwrap();
      }
    }
  }
);

export const fetchCompany = createAsyncThunk<Company | null, void, { rejectValue: ErrorResponse }>(
  'setup/getCompany',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Company>(URLS.company);

      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: 'No Company found',
      });
    }
  }
);

export const createCompany = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'setup/setCompany',
  async (company, { rejectWithValue }) => {
    try {
      await axios.post<Company>(URLS.company, { name: company });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const fetchBranches = createAsyncThunk<PaginatedResponse<Branch> | null, PaginationParams, { rejectValue: ErrorResponse }>(
  'setup/getBranches',
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<PaginatedResponse<Branch>>(`${URLS.branches}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      if (!data.items.length) {
        return rejectWithValue({
          status: 404,
          title: 'No Branches found',
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: 'No Branches found',
      });
    }
  }
);

export const createBranch = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'setup/setBranch',
  async (branch, { rejectWithValue }) => {
    try {
      await axios.post<Branch>(URLS.branches, { name: branch });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const fetchEmployee = createAsyncThunk<Employee | null, void, { rejectValue: ErrorResponse }>(
  'setup/getEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Employee>(URLS.employee);

      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: 'No Employee found',
      });
    }
  }
);

export const createEmployee = createAsyncThunk<void, Employee, { rejectValue: ErrorResponse }>(
  'setup/setEmployee',
  async (employee, { rejectWithValue }) => {
    try {
      await axios.post<Employee>(URLS.employee, employee);
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.company.status = 'loading';
        state.status = 'loading';
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.status = 'failed';
        state.status = 'failed';
        state.company.error = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<Company | null>) => {
        state.company.data = action.payload;
        state.company.status = 'succeeded';
        state.step = SetupStep.BRANCHES;
      })
      .addCase(createCompany.pending, (state) => {
        state.company.status = 'loading';
      })
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.status = 'failed';
        state.company.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state) => {
        state.company.status = 'succeeded';
        state.step = SetupStep.BRANCHES;
      })
      .addCase(fetchBranches.pending, (state) => {
        state.branches.status = 'loading';
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branches.data = null;
        state.branches.status = 'failed';
        state.status = 'failed';
        state.branches.error = action.payload;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | null>) => {
        state.branches.data = action.payload;
        state.branches.status = 'succeeded';
        state.step = SetupStep.EMPLOYEE;
      })
      .addCase(createBranch.pending, (state) => {
        state.branches.status = 'loading';
      })
      .addCase(createBranch.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branches.status = 'failed';
        state.branches.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state) => {
        state.branches.status = 'succeeded';
        state.step = SetupStep.EMPLOYEE;
      })
      .addCase(fetchEmployee.pending, (state) => {
        state.employee.status = 'loading';
      })
      .addCase(fetchEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.data = null;
        state.employee.status = 'failed';
        state.status = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<Employee | null>) => {
        state.employee.data = action.payload;
        state.employee.status = 'succeeded';
        state.status = 'succeeded';
        state.step = SetupStep.COMPLETED;
      })
      .addCase(createEmployee.pending, (state) => {
        state.employee.status = 'loading';
      })
      .addCase(createEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.status = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.employee.status = 'succeeded';
        state.step = SetupStep.COMPLETED;
      });
  },
});

export const selectCompany = (state: RootState) => state.setup.company;
export const selectBranches = (state: RootState) => state.setup.branches;
export const selectEmployee = (state: RootState) => state.setup.employee;
export const selectStep = (state: RootState) => state.setup.step;
export const selectSetupStatus = (state: RootState) => state.setup.status;
export default setupSlice.reducer;
