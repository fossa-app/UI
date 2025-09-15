import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserManager, mapUser } from 'shared/helpers';
import { AppUser, ErrorResponseDTO } from 'shared/models';
import { MESSAGES } from 'shared/constants';

export const fetchUser = createAsyncThunk<AppUser | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserManager().getUser();

      if (user) {
        return mapUser(user);
      }

      return rejectWithValue({
        title: MESSAGES.error.general.unAuthorized,
        status: 401,
      });
    } catch (error) {
      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);
