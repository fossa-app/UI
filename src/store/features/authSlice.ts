import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { OidcClientSettings } from 'oidc-client-ts';
import { RootState, StateEntity } from 'store';
import { getUserManager, updateUserManager, mapUser, decodeJwt } from 'shared/helpers';
import { AppUser, ErrorResponseDTO, UserRole } from 'shared/models';
import { MESSAGES, OIDC_INITIAL_CONFIG } from 'shared/constants';

interface AuthState {
  settings: StateEntity<OidcClientSettings>;
  user: StateEntity<AppUser | undefined>;
}

const initialState: AuthState = {
  settings: {
    data: OIDC_INITIAL_CONFIG,
    status: 'idle',
  },
  user: {
    data: undefined,
    status: 'idle',
  },
};

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
      state.user.data = undefined;
      state.user.status = 'failed';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.user.status = 'loading';
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.user.data = undefined;
        state.user.status = 'failed';
        state.user.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AppUser | undefined>) => {
        state.user.data = action.payload;
        state.user.status = 'succeeded';

        const atClaims = decodeJwt<AppUser>(action.payload?.access_token);

        if (state.user.data) {
          state.user.data.roles = atClaims?.roles?.length ? (atClaims.roles as UserRole[]) : [UserRole.user];
        }
      });
  },
});

export const { updateAuthSettings, removeUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRoles = (state: RootState) => state.auth.user.data?.roles;
export const selectIsUserAdmin = (state: RootState) => state.auth.user.data?.roles?.includes(UserRole.administrator) ?? false;
export const selectAuthSettings = (state: RootState) => state.auth.settings;

export default authSlice.reducer;
