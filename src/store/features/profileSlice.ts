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
    item: undefined,
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
        const user = state.auth.user.item;

        return mapEmployee({ user, employee: data });
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

export const deleteProfile = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'profile/deleteProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(ENDPOINTS.employee);

      dispatch(setSuccess(MESSAGES.success.employee.deleteProfile));
    } catch (error) {
      if ((error as ErrorResponseDTO).status === 424) {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.employee.deleteProfileDependency,
          })
        );
      } else {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.employee.deleteProfile,
          })
        );
      }

      return rejectWithValue(error as ErrorResponseDTO);
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
        state.profile.fetchError = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Employee | undefined>) => {
        state.profile.item = action.payload;
        state.profile.item!.isDraft = false;
        state.profile.fetchStatus = 'succeeded';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AppUser | undefined>) => {
        state.profile.item = mapUserProfileToEmployee(action.payload?.profile);
        state.profile.item!.isDraft = true;
        state.profile.fetchStatus = 'succeeded';
      })
      .addCase(createProfile.pending, (state) => {
        state.profile.updateStatus = 'loading';
      })
      .addCase(createProfile.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.profile.updateStatus = 'failed';
        state.profile.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createProfile.fulfilled, (state) => {
        state.profile.updateStatus = 'succeeded';
        state.profile.updateError = undefined;
      })
      .addCase(editProfile.pending, (state) => {
        state.profile.updateStatus = 'loading';
      })
      .addCase(editProfile.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.profile.updateStatus = 'failed';
        state.profile.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editProfile.fulfilled, (state) => {
        state.profile.updateStatus = 'succeeded';
        state.profile.updateError = undefined;
      })
      .addCase(deleteProfile.pending, (state) => {
        state.profile.deleteStatus = 'loading';
      })
      .addCase(deleteProfile.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.profile.deleteStatus = 'failed';
        state.profile.fetchError = action.payload;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.profile.deleteStatus = 'succeeded';
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;

export const { resetProfileFetchStatus } = profileSlice.actions;

export default profileSlice.reducer;
