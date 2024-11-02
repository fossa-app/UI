import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Branch, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, URLS } from 'shared/constants';

interface BranchState {
  branch: StateEntity<Branch | null>;
  branches: StateEntity<PaginatedResponse<Branch> | null>;
}

const initialState: BranchState = {
  branch: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  branches: {
    data: null,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
};

export const fetchBranches = createAsyncThunk<
  PaginatedResponse<Branch> | null,
  [PaginationParams, boolean?],
  { rejectValue: ErrorResponse }
>('branch/getBranches', async ([{ pageNumber, pageSize }, shouldRejectEmptyResponse = false], { rejectWithValue }) => {
  try {
    const { data } = await axios.get<PaginatedResponse<Branch>>(`${URLS.branches}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

    if (!data.items.length && shouldRejectEmptyResponse) {
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
});

export const fetchBranchById = createAsyncThunk<Branch, string, { rejectValue: ErrorResponse }>(
  'branch/getBranchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Branch>(`${URLS.branches}/${id}`);

      return data;
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const createBranch = createAsyncThunk<void, [Branch, boolean?], { rejectValue: ErrorResponse }>(
  'branch/setBranch',
  async ([branch, shouldFetchBranches = true], { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(URLS.branches, branch);

      if (shouldFetchBranches) {
        await dispatch(fetchBranches([{ pageNumber: 1, pageSize: 1 }])).unwrap();
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.branches.createFailed,
      });
    }
  }
);

export const editBranch = createAsyncThunk<void, [string, Omit<Branch, 'id'>], { rejectValue: ErrorResponse }>(
  'branch/editBranch',
  async ([id, branch], { rejectWithValue }) => {
    try {
      await axios.put<Branch>(`${URLS.branches}/${id}`, branch);
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.branches.updateFailed,
      });
    }
  }
);

export const deleteBranch = createAsyncThunk<void, Branch['id'], { state: RootState; rejectValue: ErrorResponse }>(
  'branch/deleteBranch',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.delete<void>(`${URLS.branches}/${id}`);
      // TODO: get rid of fetching branches on delete, set the status instead
      const { pageNumber, pageSize } = getState().branch.branches.page!;

      await dispatch(fetchBranches([{ pageSize, pageNumber }])).unwrap();
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
  reducers: {
    setBranchesPagination(state, action: PayloadAction<PaginationParams>) {
      state.branches.page = action.payload;
    },
  },
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
        state.branches.page!.totalItems = action.payload?.totalItems;
        state.branches.page!.totalPages = action.payload?.totalPages;
        state.branches.fetchStatus = 'succeeded';
        state.branches.error = undefined;
      })
      .addCase(fetchBranchById.pending, (state) => {
        state.branch.fetchStatus = 'loading';
      })
      .addCase(fetchBranchById.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branch.data = null;
        state.branch.fetchStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(fetchBranchById.fulfilled, (state, action: PayloadAction<Branch | null>) => {
        state.branch.data = action.payload;
        state.branch.fetchStatus = 'succeeded';
        state.branch.error = undefined;
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
        state.branch.error = undefined;
      })
      .addCase(editBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(editBranch.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(editBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
        state.branch.error = undefined;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.branch.deleteStatus = 'loading';
      })
      .addCase(deleteBranch.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branch.deleteStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(deleteBranch.fulfilled, (state) => {
        state.branch.deleteStatus = 'succeeded';
        state.branch.error = undefined;
      });
  },
});

export const selectBranch = (state: RootState) => state.branch.branch;
export const selectBranches = (state: RootState) => state.branch.branches;

export const { setBranchesPagination } = branchSlice.actions;

export default branchSlice.reducer;
