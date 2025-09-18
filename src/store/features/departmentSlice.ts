import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { PaginatedStateEntity, RootState, StateEntity } from 'store';
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
  fetchAssignedDepartments,
  fetchDepartmentById,
  fetchDepartments,
  fetchParentDepartments,
  fetchSearchedDepartments,
} from 'store/thunks';
import { ErrorResponseDTO, ErrorResponse, PaginatedResponse, PaginationParams, Department, DepartmentDTO } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { mergePaginatedItems } from 'store/helpers';

interface DepartmentState {
  department: StateEntity<Department | undefined>;
  departmentCatalog: PaginatedStateEntity<Department>;
  searchedDepartments: PaginatedStateEntity<Department>;
  parentDepartments: PaginatedStateEntity<DepartmentDTO>;
  assignedDepartments: PaginatedStateEntity<DepartmentDTO>;
}

const initialState: DepartmentState = {
  department: {
    item: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  departmentCatalog: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  searchedDepartments: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  parentDepartments: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  assignedDepartments: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    updateDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.departmentCatalog.page = { ...state.departmentCatalog.page, ...action.payload };
    },
    resetDepartmentsPagination(state) {
      state.departmentCatalog.page = initialState.departmentCatalog.page;
    },
    updateParentDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.parentDepartments.page = { ...state.parentDepartments.page, ...action.payload };
    },
    updateAssignedDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.assignedDepartments.page = { ...state.assignedDepartments.page, ...action.payload };
    },
    resetDepartmentsFetchStatus(state) {
      state.departmentCatalog.status = initialState.departmentCatalog.status;
    },
    resetParentDepartmentsFetchStatus(state) {
      state.parentDepartments.status = initialState.parentDepartments.status;
    },
    resetParentDepartments(state) {
      state.parentDepartments.status = initialState.parentDepartments.status;
      state.parentDepartments.items = initialState.parentDepartments.items;
    },
    resetAssignedDepartmentsFetchStatus(state) {
      state.assignedDepartments.status = initialState.assignedDepartments.status;
    },
    resetDepartment(state) {
      state.department = initialState.department as WritableDraft<StateEntity<Department>>;
    },
    resetDepartmentErrors(state) {
      state.department.fetchError = undefined;
      state.department.updateError = undefined;
      state.department.deleteError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentCatalog.status = 'loading';
      })
      .addCase(fetchDepartments.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.departmentCatalog.items = [];
        state.departmentCatalog.status = 'failed';
        state.departmentCatalog.error = action.payload;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Department> | undefined>) => {
        const { items = [], ...page } = action.payload || {};

        state.departmentCatalog.items = items;
        state.departmentCatalog.page = page;
        state.departmentCatalog.status = 'succeeded';
        state.departmentCatalog.error = undefined;
      })
      .addCase(fetchSearchedDepartments.pending, (state) => {
        state.searchedDepartments.status = 'loading';
      })
      .addCase(fetchSearchedDepartments.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.searchedDepartments.items = [];
        state.searchedDepartments.status = 'failed';
        state.searchedDepartments.error = action.payload;
      })
      .addCase(fetchSearchedDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Department> | undefined>) => {
        const { items = [], ...page } = action.payload || {};

        state.searchedDepartments.items = items;
        state.searchedDepartments.page = page;
        state.searchedDepartments.status = 'succeeded';
        state.searchedDepartments.error = undefined;
      })
      .addCase(fetchParentDepartments.pending, (state) => {
        state.parentDepartments.status = 'loading';
      })
      .addCase(fetchParentDepartments.fulfilled, (state, action) => {
        const { items = [], ...page } = action.payload || {};

        state.parentDepartments.items = mergePaginatedItems<DepartmentDTO>(state.parentDepartments.items, items);
        state.parentDepartments.page = page;
        state.parentDepartments.status = 'succeeded';
      })
      .addCase(fetchParentDepartments.rejected, (state) => {
        state.parentDepartments.status = 'failed';
      })
      .addCase(fetchAssignedDepartments.pending, (state) => {
        state.assignedDepartments.status = 'loading';
      })
      .addCase(fetchAssignedDepartments.fulfilled, (state, action) => {
        const { items = [], ...page } = action.payload || {};

        state.assignedDepartments.items = mergePaginatedItems<DepartmentDTO>(state.assignedDepartments.items, items);
        state.assignedDepartments.page = page;
        state.assignedDepartments.status = 'succeeded';
      })
      .addCase(fetchAssignedDepartments.rejected, (state) => {
        state.assignedDepartments.status = 'failed';
      })
      .addCase(fetchDepartmentById.pending, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.fetchStatus = 'loading';
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.item = undefined;
        state.department.fetchStatus = 'failed';
        state.department.fetchError = action.payload;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.item = action.payload;
        state.department.fetchStatus = 'succeeded';
        state.department.fetchError = undefined;
      })
      .addCase(createDepartment.pending, (state) => {
        state.department.updateStatus = 'loading';
      })
      .addCase(createDepartment.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.department.updateStatus = 'failed';
        state.department.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.department.updateStatus = 'succeeded';
        state.department.updateError = undefined;
      })
      .addCase(editDepartment.pending, (state) => {
        state.department.updateStatus = 'loading';
      })
      .addCase(editDepartment.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.department.updateStatus = 'failed';
        state.department.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editDepartment.fulfilled, (state) => {
        state.department.updateStatus = 'succeeded';
        state.department.updateError = undefined;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.department.deleteStatus = 'loading';
      })
      .addCase(deleteDepartment.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.department.deleteStatus = 'failed';
        state.department.deleteError = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state) => {
        state.department.deleteStatus = 'succeeded';
        state.department.deleteError = undefined;
      });
  },
});

export const selectDepartment = (state: RootState) => state.department.department;
export const selectDepartmentCatalog = (state: RootState) => state.department.departmentCatalog;
export const selectSearchedDepartments = (state: RootState) => state.department.searchedDepartments;
export const selectParentDepartments = (state: RootState) => state.department.parentDepartments;
export const selectAssignedDepartments = (state: RootState) => state.department.assignedDepartments;

export const {
  updateDepartmentsPagination,
  resetDepartmentsPagination,
  updateParentDepartmentsPagination,
  resetDepartmentsFetchStatus,
  resetParentDepartments,
  resetParentDepartmentsFetchStatus,
  updateAssignedDepartmentsPagination,
  resetAssignedDepartmentsFetchStatus,
  resetDepartment,
  resetDepartmentErrors,
} = departmentSlice.actions;

export default departmentSlice.reducer;
