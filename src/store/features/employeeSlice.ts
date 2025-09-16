import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { PaginatedStateEntity, RootState, StateEntity } from 'store';
import { Employee, EmployeeDTO, ErrorResponse, ErrorResponseDTO, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { mergePaginatedItems } from 'store/helpers';
import { editEmployee, fetchEmployeeById, fetchEmployees, fetchManagers, fetchOrgChartEmployees } from 'store/thunks';

interface EmployeeState {
  employee: StateEntity<Employee | undefined>;
  employeeCatalog: PaginatedStateEntity<Employee>;
  managers: PaginatedStateEntity<EmployeeDTO>;
  employeeOrgChart: PaginatedStateEntity<EmployeeDTO>;
}

const initialState: EmployeeState = {
  employee: {
    item: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  employeeCatalog: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  managers: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  employeeOrgChart: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    updateEmployeesPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.employeeCatalog.page = { ...state.employeeCatalog.page, ...action.payload };
    },
    resetEmployeesPagination(state) {
      state.employeeCatalog.page = initialState.employeeCatalog.page;
    },
    updateManagersPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.managers.page = { ...state.managers.page, ...action.payload };
    },
    resetEmployeesFetchStatus(state) {
      state.employeeCatalog.status = initialState.employeeCatalog.status;
    },
    resetManagersFetchStatus(state) {
      state.managers.status = initialState.managers.status;
    },
    resetOrgChartEmployeesFetchStatus(state) {
      state.employeeOrgChart.status = initialState.employeeOrgChart.status;
    },
    resetEmployee(state) {
      state.employee = initialState.employee as WritableDraft<StateEntity<Employee>>;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.employeeCatalog.status = 'loading';
      })
      .addCase(fetchEmployees.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.employeeCatalog.items = [];
        state.employeeCatalog.status = 'failed';
        state.employeeCatalog.error = action.payload;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<PaginatedResponse<Employee> | undefined>) => {
        const { items = [], ...page } = action.payload || {};

        state.employeeCatalog.items = items;
        state.employeeCatalog.page = page;
        state.employeeCatalog.status = 'succeeded';
        state.employeeCatalog.error = undefined;
      })
      .addCase(fetchManagers.pending, (state) => {
        state.managers.status = 'loading';
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        const { items = [], ...page } = action.payload || {};

        state.managers.items = mergePaginatedItems<EmployeeDTO>(state.managers.items, items);
        state.managers.page = page;
        state.managers.status = 'succeeded';
      })
      .addCase(fetchManagers.rejected, (state) => {
        state.managers.status = 'failed';
      })
      .addCase(fetchEmployeeById.pending, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchOrgChartEmployees.pending, (state) => {
        state.employeeOrgChart.status = 'loading';
      })
      .addCase(fetchOrgChartEmployees.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.employeeOrgChart.items = [];
        state.employeeOrgChart.status = 'failed';
        state.employeeOrgChart.error = action.payload;
      })
      .addCase(fetchOrgChartEmployees.fulfilled, (state, action: PayloadAction<PaginatedResponse<EmployeeDTO> | undefined>) => {
        const { items = [] } = action.payload || {};
        state.employeeOrgChart.items = items;
        state.employeeOrgChart.status = 'succeeded';
        state.employeeOrgChart.error = undefined;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.employee.item = undefined;
        state.employee.fetchStatus = 'failed';
        state.employee.fetchError = action.payload;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.employee.item = action.payload;
        state.employee.fetchStatus = 'succeeded';
        state.employee.fetchError = undefined;
      })
      .addCase(editEmployee.pending, (state) => {
        state.employee.updateStatus = 'loading';
      })
      .addCase(editEmployee.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.employee.updateStatus = 'failed';
        state.employee.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.employee.updateStatus = 'succeeded';
        state.employee.updateError = undefined;
      });
  },
});

export const selectEmployeeCatalog = (state: RootState) => state.employee.employeeCatalog;
export const selectManagers = (state: RootState) => state.employee.managers;
export const selectEmployeeOrgChart = (state: RootState) => state.employee.employeeOrgChart;
export const selectEmployee = (state: RootState) => state.employee.employee;

export const {
  updateEmployeesPagination,
  resetEmployeesPagination,
  updateManagersPagination,
  resetEmployeesFetchStatus,
  resetManagersFetchStatus,
  resetOrgChartEmployeesFetchStatus,
  resetEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
