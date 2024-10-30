import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { OidcClientSettings } from 'oidc-client-ts';
import { RootState, StateEntity } from 'store';
import { getUserManager, updateUserManager, mapUser, decodeJwt } from 'shared/helpers';
import { AppUser, ErrorResponse } from 'shared/models';
import { ADMIN_ROLE_NAME, MESSAGES, OIDC_INITIAL_CONFIG } from 'shared/constants';

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

export const fetchUser = createAsyncThunk<AppUser | null, void, { rejectValue: ErrorResponse }>(
  'auth/getchUser',
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
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuthSettings(state, action: PayloadAction<Partial<OidcClientSettings>>) {
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
      .addCase(fetchUser.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.user.data = null;
        state.user.status = 'failed';
        state.user.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AppUser | null>) => {
        state.user.data = action.payload;
        state.user.status = 'succeeded';

        const atClaims = decodeJwt(action.payload?.access_token);

        if (state.user.data && atClaims?.roles?.length) {
          state.user.data.roles = atClaims?.roles;
        }
      });
  },
});

export const { updateAuthSettings, removeUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsUserAdmin = (state: RootState) => state.auth.user.data?.roles?.includes(ADMIN_ROLE_NAME) ?? false;
export const selectAuthSettings = (state: RootState) => state.auth.settings;

export default authSlice.reducer;
