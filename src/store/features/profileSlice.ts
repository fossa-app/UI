import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import { createProfile, deleteProfile, editProfile, fetchProfile, fetchUser } from 'store/thunks';
import { AppUser, Employee, ErrorResponse, ErrorResponseDTO } from 'shared/models';
import { mapUserProfileToEmployee } from 'shared/helpers';

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
