import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Branch, BranchDTO, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import { setError } from './errorSlice';
import { mapBranch, mapBranches, prepareQueryParams } from 'shared/helpers';

interface BranchState {
  branch: StateEntity<Branch | undefined>;
  branches: StateEntity<PaginatedResponse<Branch> | undefined>;
}

const initialState: BranchState = {
  branch: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  branches: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
};

export const fetchBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  [Partial<PaginationParams>, boolean?],
  { rejectValue: ErrorResponse }
>('branch/getBranches', async ([{ pageNumber, pageSize, search }, shouldRejectEmptyResponse = false], { getState, rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

    if (!data.items.length && shouldRejectEmptyResponse) {
      return rejectWithValue({
        status: 404,
        title: MESSAGES.error.branches.notFound,
      });
    }

    const state = getState() as RootState;
    const timeZones = state.license.system.data?.entitlements.timeZones || [];
    const countries = state.license.system.data?.entitlements.countries || [];
    const companyCountryCode = state.company.company.data!.countryCode;

    return {
      ...data,
      items: mapBranches(data.items, timeZones, companyCountryCode, countries),
    };
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponse),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchBranchById = createAsyncThunk<Branch, string, { rejectValue: ErrorResponse }>(
  'branch/getBranchById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<BranchDTO>(`${ENDPOINTS.branches}/${id}`);
      const state = getState() as RootState;
      const timeZones = state.license.system.data?.entitlements.timeZones || [];
      const countries = state.license.system.data?.entitlements.countries || [];
      const companyCountryCode = state.company.company.data!.countryCode;

      return mapBranch(data, timeZones, companyCountryCode, countries);
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const createBranch = createAsyncThunk<void, [BranchDTO, boolean?], { rejectValue: ErrorResponse }>(
  'branch/setBranch',
  async ([branch, shouldFetchBranches = true], { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.branches, branch);

      if (shouldFetchBranches) {
        await dispatch(fetchBranches([APP_CONFIG.table.defaultPagination])).unwrap();
      }
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.branches.createFailed,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const editBranch = createAsyncThunk<void, [string, Omit<BranchDTO, 'id'>], { rejectValue: ErrorResponse }>(
  'branch/editBranch',
  async ([id, branch], { dispatch, rejectWithValue }) => {
    try {
      await axios.put<BranchDTO>(`${ENDPOINTS.branches}/${id}`, branch);
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.branches.updateFailed,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const deleteBranch = createAsyncThunk<void, BranchDTO['id'], { state: RootState; rejectValue: ErrorResponse }>(
  'branch/deleteBranch',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(`${ENDPOINTS.branches}/${id}`);

      dispatch(resetBranchesFetchStatus());
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.branches.deleteFailed,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranchesPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.branches.page = { ...state.branches.page, ...action.payload };
    },
    resetBranch(state) {
      state.branch = initialState.branch;
    },
    resetBranchesFetchStatus(state) {
      state.branches.fetchStatus = initialState.branches.fetchStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.branches.fetchStatus = 'loading';
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.branches.data = undefined;
        state.branches.fetchStatus = 'failed';
        state.branches.error = action.payload;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | undefined>) => {
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
        state.branch.data = undefined;
        state.branch.fetchStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(fetchBranchById.fulfilled, (state, action: PayloadAction<Branch | undefined>) => {
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

export const { setBranchesPagination, resetBranch, resetBranchesFetchStatus } = branchSlice.actions;

export default branchSlice.reducer;
