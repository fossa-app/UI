import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, PaginatedStateEntity, StateEntity } from 'store';
import { Branch, BranchDTO, ErrorResponseDTO, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { mergePaginatedItems } from 'store/helpers';
import {
  createBranch,
  createOnboardingBranch,
  deleteBranch,
  editBranch,
  fetchAssignedBranches,
  fetchBranchById,
  fetchBranches,
} from 'store/thunks';

interface BranchState {
  branch: StateEntity<Branch | undefined>;
  branchCatalog: PaginatedStateEntity<Branch>;
  assignedBranches: PaginatedStateEntity<BranchDTO>;
}

const initialState: BranchState = {
  branch: {
    item: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  branchCatalog: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  assignedBranches: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    updateBranchesPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.branchCatalog.page = { ...state.branchCatalog.page, ...action.payload };
    },
    resetBranchesPagination(state) {
      state.branchCatalog.page = initialState.branchCatalog.page;
    },
    updateAssignedBranchesPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.assignedBranches.page = { ...state.assignedBranches.page, ...action.payload };
    },
    resetBranchesFetchStatus(state) {
      state.branchCatalog.status = initialState.branchCatalog.status;
    },
    resetAssignedBranchesFetchStatus(state) {
      state.assignedBranches.status = initialState.assignedBranches.status;
    },
    resetBranch(state) {
      state.branch = initialState.branch as WritableDraft<StateEntity<Branch>>;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.branchCatalog.status = 'loading';
      })
      .addCase(fetchBranches.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.branchCatalog.items = [];
        state.branchCatalog.status = 'failed';
        state.branchCatalog.error = action.payload;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<PaginatedResponse<Branch> | undefined>) => {
        const { items = [], ...page } = action.payload || {};

        state.branchCatalog.items = items;
        state.branchCatalog.page = page;
        state.branchCatalog.status = 'succeeded';
        state.branchCatalog.error = undefined;
      })
      .addCase(fetchAssignedBranches.pending, (state) => {
        state.assignedBranches.status = 'loading';
      })
      .addCase(fetchAssignedBranches.fulfilled, (state, action) => {
        const { items = [], ...page } = action.payload || {};

        state.assignedBranches.items = mergePaginatedItems<BranchDTO>(state.assignedBranches.items, items);
        state.assignedBranches.page = page;
        state.assignedBranches.status = 'succeeded';
      })
      .addCase(fetchAssignedBranches.rejected, (state) => {
        state.assignedBranches.status = 'failed';
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

        state.branch.item = undefined;
        state.branch.fetchStatus = 'failed';
        state.branch.fetchError = action.payload;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.branch.item = action.payload;
        state.branch.fetchStatus = 'succeeded';
        state.branch.fetchError = undefined;
      })
      .addCase(createBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(createBranch.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
        state.branch.updateError = undefined;
      })
      .addCase(createOnboardingBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(createOnboardingBranch.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createOnboardingBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
        state.branch.updateError = undefined;
      })
      .addCase(editBranch.pending, (state) => {
        state.branch.updateStatus = 'loading';
      })
      .addCase(editBranch.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.branch.updateStatus = 'failed';
        state.branch.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editBranch.fulfilled, (state) => {
        state.branch.updateStatus = 'succeeded';
        state.branch.updateError = undefined;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.branch.deleteStatus = 'loading';
      })
      .addCase(deleteBranch.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.branch.deleteStatus = 'failed';
        state.branch.deleteError = action.payload;
      })
      .addCase(deleteBranch.fulfilled, (state) => {
        state.branch.deleteStatus = 'succeeded';
        state.branch.deleteError = undefined;
      });
  },
});

export const selectBranch = (state: RootState) => state.branch.branch;
export const selectBranchCatalog = (state: RootState) => state.branch.branchCatalog;
export const selectAssignedBranches = (state: RootState) => state.branch.assignedBranches;

export const {
  updateBranchesPagination,
  resetBranchesPagination,
  updateAssignedBranchesPagination,
  resetAssignedBranchesFetchStatus,
  resetBranch,
  resetBranchesFetchStatus,
} = branchSlice.actions;

export default branchSlice.reducer;
