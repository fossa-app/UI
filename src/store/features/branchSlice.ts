import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios.config';
import { Branch, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';

interface BranchState {
  branches: StateEntity<PaginatedResponse<Branch> | null>;
}

const initialState: BranchState = {
  branches: {
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
      return rejectWithValue(error as ErrorResponse);
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
        state.branches.fetchStatus = 'loading';
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branches.data = null;
        state.branches.fetchStatus = 'failed';
        state.branches.error = action.payload;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | null>) => {
        state.branches.data = action.payload;
        state.branches.fetchStatus = 'succeeded';
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
      });
  },
});

export const selectBranches = (state: RootState) => state.branch.branches;

export default branchSlice.reducer;
