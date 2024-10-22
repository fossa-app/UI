import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios.config';
import { Employee, ErrorResponse } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';

interface SetupState {
  employee: StateEntity<Employee | null>;
}

const initialState: SetupState = {
  employee: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchEmployee = createAsyncThunk<Employee | null, void, { rejectValue: ErrorResponse }>(
  'employee/getEmployee',
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

export const createEmployee = createAsyncThunk<void, Employee, { rejectValue: ErrorResponse }>(
  'employee/setEmployee',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<Employee>(URLS.employee, employee);
      await dispatch(fetchEmployee()).unwrap();
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.data = null;
        state.employee.fetchStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<Employee | null>) => {
        state.employee.data = action.payload;
        state.employee.fetchStatus = 'succeeded';
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

export const selectEmployee = (state: RootState) => state.employee.employee;

export default employeeSlice.reducer;
