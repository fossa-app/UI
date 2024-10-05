import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { RootState } from 'store';
import { Branch, Company, ErrorResponse, PaginatedResponse, PaginationParams, SetupStep, StateEntity } from 'shared/models';
import { URLS } from 'shared/constants';

interface SetupState {
  company: StateEntity<Company | null>;
  branches: StateEntity<PaginatedResponse<Branch> | null>;
  step: SetupStep;
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
  step: SetupStep.COMPANY,
};

// TODO: move to companySlice
export const fetchCompany = createAsyncThunk<Company | null, void, { rejectValue: ErrorResponse }>(
  'setup/fetchCompany',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Company>(URLS.company);

      return data || rejectWithValue({ title: 'No company found' });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
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

// TODO: move to branchesSlice
export const fetchBranches = createAsyncThunk<PaginatedResponse<Branch> | null, PaginationParams, { rejectValue: ErrorResponse }>(
  'setup/fetchBranches',
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<PaginatedResponse<Branch>>(`${URLS.branches}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      return data || rejectWithValue({ title: 'No branches found' });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
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

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.company.status = 'loading';
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.status = 'failed';
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
      });
  },
});

export const selectCompany = (state: RootState) => state.setup.company;
export const selectBranches = (state: RootState) => state.setup.branches;
export const selectStep = (state: RootState) => state.setup.step;
export default setupSlice.reducer;
