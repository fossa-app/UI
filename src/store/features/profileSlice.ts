import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { AppUser, Employee, EmployeeDTO, ErrorResponse, ErrorResponseDTO } from 'shared/models';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapEmployee, mapError, mapUserProfileToEmployee } from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';
import { fetchUser } from './authSlice';

interface ProfileState {
  profile: StateEntity<Employee | undefined>;
}

const initialState: ProfileState = {
  profile: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchProfile = createAsyncThunk<Employee | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<EmployeeDTO>(ENDPOINTS.employee);

      if (data) {
        const state = getState() as RootState;
        const user = state.auth.user.data;

        return mapEmployee(data, user);
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const createProfile = createAsyncThunk<void, EmployeeDTO, { state: RootState; rejectValue: ErrorResponse<FieldValues> }>(
  'profile/createProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.employee, employee);
      await dispatch(fetchProfile()).unwrap();

      dispatch(setSuccess(MESSAGES.success.employee.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.employee.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editProfile = createAsyncThunk<void, Omit<EmployeeDTO, 'id'>, { rejectValue: ErrorResponse<FieldValues> }>(
  'profile/editProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<void>(ENDPOINTS.employee, employee);

      dispatch(setSuccess(MESSAGES.success.employee.updateProfile));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.employee.updateProfile,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileFetchStatus(state) {
      state.profile.fetchStatus = initialState.profile.fetchStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profile.fetchStatus = 'loading';
      })
      .addCase(fetchProfile.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.profile.fetchStatus = 'failed';
        state.profile.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Employee | undefined>) => {
        state.profile.data = action.payload;
        state.profile.data!.isDraft = false;
        state.profile.fetchStatus = 'succeeded';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AppUser | undefined>) => {
        state.profile.data = mapUserProfileToEmployee(action.payload?.profile);
        state.profile.data!.isDraft = true;
        state.profile.fetchStatus = 'succeeded';
      })
      .addCase(createProfile.pending, (state) => {
        state.profile.updateStatus = 'loading';
      })
      .addCase(createProfile.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.profile.updateStatus = 'failed';
        state.profile.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createProfile.fulfilled, (state) => {
        state.profile.updateStatus = 'succeeded';
      })
      .addCase(editProfile.pending, (state) => {
        state.profile.updateStatus = 'loading';
      })
      .addCase(editProfile.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.profile.updateStatus = 'failed';
        state.profile.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editProfile.fulfilled, (state) => {
        state.profile.updateStatus = 'succeeded';
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;

export const { resetProfileFetchStatus } = profileSlice.actions;

export default profileSlice.reducer;
