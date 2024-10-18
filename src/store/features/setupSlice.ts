import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios.config';
import { Branch, Company, Employee, ErrorResponse, PaginatedResponse, PaginationParams, SetupStep } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';

interface SetupState {
  company: StateEntity<Company | null>;
  branches: StateEntity<PaginatedResponse<Branch> | null>;
  employee: StateEntity<Employee | null>;
  step: StateEntity<SetupStep>;
}

const initialState: SetupState = {
  company: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
  branches: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
  employee: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
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
      const branchesResponse = await dispatch(fetchBranches({ pageNumber: 1, pageSize: 1 })).unwrap();

      if (branchesResponse?.items.length) {
        await dispatch(fetchEmployee()).unwrap();
      }
    }
  }
);

// TODO: move to companySlice
export const fetchCompany = createAsyncThunk<Company | null, boolean | undefined, { rejectValue: ErrorResponse }>(
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
        title: MESSAGES.error.company.notFound,
      });
    }
  }
);

// TODO: move to companySlice
export const createCompany = createAsyncThunk<Company, Company, { rejectValue: ErrorResponse }>(
  'setup/setCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<Company>(URLS.company, company);
      await dispatch(fetchCompany(false)).unwrap();

      return company;
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

// TODO: move to branchesSlice
export const fetchBranches = createAsyncThunk<PaginatedResponse<Branch> | null, PaginationParams, { rejectValue: ErrorResponse }>(
  'setup/getBranches',
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<PaginatedResponse<Branch>>(`${URLS.branches}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      if (!data.items.length) {
        return rejectWithValue({
          status: 404,
          title: MESSAGES.error.branches.notFound,
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.branches.notFound,
      });
    }
  }
);

// TODO: move to branchesSlice
export const createBranch = createAsyncThunk<void, Branch, { rejectValue: ErrorResponse }>(
  'setup/setBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<Branch>(URLS.branches, branch);
      await dispatch(fetchBranches({ pageSize: 1, pageNumber: 1 })).unwrap();
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

// TODO: move to employeeSlice
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
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

// TODO: move to employeeSlice
export const createEmployee = createAsyncThunk<void, Employee, { rejectValue: ErrorResponse }>(
  'setup/setEmployee',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<Employee>(URLS.employee, employee);
      await dispatch(fetchEmployee()).unwrap();
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
      .addCase(fetchCompany.pending, (state, action) => {
        state.company.fetchStatus = 'loading';

        if (action.meta.arg) {
          state.step.status = 'loading';
        }
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.fetchStatus = 'failed';
        state.step.status = 'failed';
        state.company.error = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<Company | null>) => {
        state.company.data = action.payload;
        state.company.fetchStatus = 'succeeded';
        state.step.data = SetupStep.BRANCHES;
      })
      .addCase(createCompany.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.company.updateStatus = 'succeeded';
        state.company.data = action.payload;
      })
      .addCase(fetchBranches.pending, (state) => {
        state.branches.fetchStatus = 'loading';
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branches.data = null;
        state.branches.fetchStatus = 'failed';
        state.step.status = 'failed';
        state.branches.error = action.payload;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | null>) => {
        state.branches.data = action.payload;
        state.branches.fetchStatus = 'succeeded';
        state.step.data = SetupStep.EMPLOYEE;
      })
      .addCase(createBranch.pending, (state) => {
        state.branches.updateStatus = 'loading';
      })
      .addCase(createBranch.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branches.updateStatus = 'failed';
        state.branches.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state) => {
        state.branches.updateStatus = 'succeeded';
      })
      .addCase(fetchEmployee.pending, (state) => {
        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.data = null;
        state.employee.fetchStatus = 'failed';
        state.step.status = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<Employee | null>) => {
        state.employee.data = action.payload;
        state.employee.fetchStatus = 'succeeded';
        state.step.status = 'succeeded';
        state.step.data = SetupStep.COMPLETED;
      })
      .addCase(createEmployee.pending, (state) => {
        state.employee.updateStatus = 'loading';
      })
      .addCase(createEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.updateStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.employee.updateStatus = 'succeeded';
      });
  },
});

export const selectCompany = (state: RootState) => state.setup.company;
export const selectBranches = (state: RootState) => state.setup.branches;
export const selectEmployee = (state: RootState) => state.setup.employee;
export const selectStep = (state: RootState) => state.setup.step;
export default setupSlice.reducer;
