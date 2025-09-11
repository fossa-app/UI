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
    item: OIDC_INITIAL_CONFIG,
    fetchStatus: 'idle',
  },
  user: {
    item: undefined,
    fetchStatus: 'idle',
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
      state.settings.item = {
        ...state.settings.item,
        ...action.payload,
      };
      state.settings.fetchStatus = 'succeeded';

      updateUserManager(state.settings.item);
    },
    removeUser(state) {
      state.user.item = undefined;
      state.user.fetchStatus = 'failed';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.user.fetchStatus = 'loading';
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.user.item = undefined;
        state.user.fetchStatus = 'failed';
        state.user.fetchError = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AppUser | undefined>) => {
        state.user.item = action.payload;
        state.user.fetchStatus = 'succeeded';

        const atClaims = decodeJwt<AppUser>(action.payload?.access_token);

        if (state.user.item) {
          state.user.item.roles = atClaims?.roles?.length ? (atClaims.roles as UserRole[]) : [UserRole.user];
        }
      });
  },
});

export const { updateAuthSettings, removeUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRoles = (state: RootState) => state.auth.user.item?.roles;
export const selectIsUserAdmin = (state: RootState) => state.auth.user.item?.roles?.includes(UserRole.administrator) ?? false;
export const selectAuthSettings = (state: RootState) => state.auth.settings;

export default authSlice.reducer;
