import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { OidcClientSettings } from 'oidc-client-ts';
import { RootState } from 'store';
import { getUserManager, updateUserManager, mapUser } from 'shared/helpers';
import { AppUser, ErrorResponse, StateEntity } from 'shared/models';
import { OIDC_INITIAL_CONFIG } from 'shared/constants';

interface AuthState {
  settings: StateEntity<OidcClientSettings>;
  user: StateEntity<AppUser | null>;
}

const initialState: AuthState = {
  settings: {
    data: OIDC_INITIAL_CONFIG,
    status: 'idle',
  },
  user: {
    data: null,
    status: 'idle',
  },
};

// TODO: use this approach in all state
export const fetchUser = createAsyncThunk<
  AppUser | null,
  void,
  { rejectValue: ErrorResponse }
>('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const user = await getUserManager().getUser();

    if (user) {
      return mapUser(user);
    }

    return rejectWithValue({ title: 'No user found' });
  } catch (error) {
    return rejectWithValue(error as ErrorResponse);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuthSettings(
      state,
      action: PayloadAction<Partial<OidcClientSettings>>
    ) {
      state.settings.data = {
        ...state.settings.data,
        ...action.payload,
      };
      state.settings.status = 'succeeded';

      updateUserManager(state.settings.data);
    },
    removeUser(state) {
      state.user.data = null;
      state.user.status = 'failed';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.user.status = 'loading';
      })
      .addCase(
        fetchUser.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.user.data = null;
          state.user.status = 'failed';
          state.user.error = action.payload;
        }
      )
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<AppUser | null>) => {
          state.user.data = action.payload;
          state.user.status = 'succeeded';
        }
      );
  },
});

export const { updateAuthSettings, removeUser } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthSettings = (state: RootState) => state.auth.settings;

export default authSlice.reducer;
