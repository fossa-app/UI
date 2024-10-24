import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios.config';
import { Branch, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';

interface BranchState {
  branch: StateEntity<PaginatedResponse<Branch> | null>;
}

const initialState: BranchState = {
  branch: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchBranches = createAsyncThunk<PaginatedResponse<Branch> | null, PaginationParams, { rejectValue: ErrorResponse }>(
  'branch/getBranches',
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

export const createBranch = createAsyncThunk<void, Branch, { rejectValue: ErrorResponse }>(
  'branch/setBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<Branch>(URLS.branches, branch);
      await dispatch(fetchBranches({ pageSize: 1, pageNumber: 1 })).unwrap();
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.branches.createFailed,
      });
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.branch.fetchStatus = 'loading';
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branch.data = null;
        state.branch.fetchStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | null>) => {
        state.branch.data = action.payload;
        state.branch.fetchStatus = 'succeeded';
      })
      .addCase(createBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(createBranch.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
      });
  },
});

export const selectBranch = (state: RootState) => state.branch.branch;

export default branchSlice.reducer;
