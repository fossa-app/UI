import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Branch, BranchDTO, ErrorResponseDTO, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapBranch, mapBranches, mapError, prepareQueryParams, prepareCommaSeparatedQueryParamsByKey } from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';

interface BranchState {
  branch: StateEntity<Branch | undefined>;
  branches: StateEntity<PaginatedResponse<Branch> | undefined>;
  searchedBranches: StateEntity<PaginatedResponse<Branch> | undefined>;
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
  searchedBranches: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
};

export const fetchBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  [Partial<PaginationParams>, boolean?],
  { rejectValue: ErrorResponseDTO }
>('branch/fetchBranches', async ([{ pageNumber, pageSize, search }, shouldRejectEmptyResponse = false], { getState, rejectWithValue }) => {
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
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchSearchedBranches = createAsyncThunk<
  PaginatedResponse<BranchDTO> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ErrorResponseDTO }
>('branch/fetchSearchedBranches', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchBranchesByIds = createAsyncThunk<PaginatedResponse<BranchDTO> | undefined, number[], { rejectValue: ErrorResponseDTO }>(
  'branch/fetchBranchesByIds',
  async (ids, { rejectWithValue }) => {
    try {
      const queryParams = prepareCommaSeparatedQueryParamsByKey('id', ids);
      const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.branches.notFound,
      });
    }
  }
);

export const fetchBranchById = createAsyncThunk<Branch, { id: string; skipState: boolean }, { rejectValue: ErrorResponseDTO }>(
  'branch/fetchBranchById',
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<BranchDTO>(`${ENDPOINTS.branches}/${id}`);
      const state = getState() as RootState;
      const timeZones = state.license.system.data?.entitlements.timeZones || [];
      const countries = state.license.system.data?.entitlements.countries || [];
      const companyCountryCode = state.company.company.data!.countryCode;

      return mapBranch(data, timeZones, companyCountryCode, countries);
    } catch (error) {
      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const createBranch = createAsyncThunk<void, [BranchDTO, boolean?], { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createBranch',
  async ([branch, shouldFetchBranches = true], { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.branches, branch);

      if (shouldFetchBranches) {
        await dispatch(fetchBranches([APP_CONFIG.table.defaultPagination])).unwrap();
      }

      dispatch(setSuccess(MESSAGES.success.branches.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editBranch = createAsyncThunk<void, [string, Omit<BranchDTO, 'id'>], { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/editBranch',
  async ([id, branch], { dispatch, rejectWithValue }) => {
    try {
      await axios.put<void>(`${ENDPOINTS.branches}/${id}`, branch);

      dispatch(setSuccess(MESSAGES.success.branches.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.update,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteBranch = createAsyncThunk<void, BranchDTO['id'], { state: RootState; rejectValue: ErrorResponseDTO }>(
  'branch/deleteBranch',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(`${ENDPOINTS.branches}/${id}`);

      dispatch(resetBranchesFetchStatus());
      dispatch(setSuccess(MESSAGES.success.branches.delete));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.delete,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
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
    resetBranchesPagination(state) {
      state.branches.page = initialState.branches.page;
    },
    resetBranch(state) {
      state.branch = initialState.branch as WritableDraft<StateEntity<Branch>>;
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
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
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
      .addCase(fetchSearchedBranches.pending, (state) => {
        state.searchedBranches.fetchStatus = 'loading';
      })
      .addCase(fetchSearchedBranches.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.searchedBranches.data = undefined;
        state.searchedBranches.fetchStatus = 'failed';
        state.searchedBranches.error = action.payload;
      })
      .addCase(fetchSearchedBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | undefined>) => {
        state.searchedBranches.data = action.payload;
        state.searchedBranches.page!.totalItems = action.payload?.totalItems;
        state.searchedBranches.page!.totalPages = action.payload?.totalPages;
        state.searchedBranches.fetchStatus = 'succeeded';
        state.searchedBranches.error = undefined;
      })
      .addCase(fetchBranchById.pending, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.branch.fetchStatus = 'loading';
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.branch.data = undefined;
        state.branch.fetchStatus = 'failed';
        state.branch.error = action.payload;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.branch.data = action.payload;
        state.branch.fetchStatus = 'succeeded';
        state.branch.error = undefined;
      })
      .addCase(createBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(createBranch.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
        state.branch.error = undefined;
      })
      .addCase(editBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(editBranch.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
        state.branch.error = undefined;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.branch.deleteStatus = 'loading';
      })
      .addCase(deleteBranch.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
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
export const selectSearchedBranches = (state: RootState) => state.branch.searchedBranches;

export const { setBranchesPagination, resetBranchesPagination, resetBranch, resetBranchesFetchStatus } = branchSlice.actions;

export default branchSlice.reducer;
