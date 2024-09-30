import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  UserManager,
  WebStorageStateStore,
  UserManagerSettings,
  OidcClientSettings,
} from 'oidc-client-ts';
import { RootState } from 'store';
import { AppUser, ErrorResponse, StateEntity } from 'shared/models';
import { AUTH_KEY, OIDC_INITIAL_CONFIG } from 'shared/constants';
import {
  mapUser,
  removeFromLocalStorage,
  saveToLocalStorage,
} from 'shared/helpers';

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

const userStore = new WebStorageStateStore({
  store: window.localStorage,
  prefix: 'oidc.',
});

let userManager: UserManager | null = null;

export const fetchUser = createAsyncThunk<
  AppUser | null,
  void,
  { rejectValue: ErrorResponse }
>('auth/fetchUser', async (_, { rejectWithValue }) => {
  const userManager = getUserManager();

  try {
    const user = await userManager.getUser();

    if (user) {
      const mappedUser = mapUser(user);

      saveToLocalStorage<AppUser>(AUTH_KEY, mappedUser);

      return mappedUser;
    }

    removeFromLocalStorage(AUTH_KEY);

    return rejectWithValue({ title: 'No user found' });
  } catch (error) {
    removeFromLocalStorage(AUTH_KEY);

    return rejectWithValue(error as ErrorResponse);
  }
});

export const getUserManager = (): UserManager => {
  if (!userManager) {
    const settings = initialState.settings;

    const userManagerConfig: UserManagerSettings = {
      ...settings.data,
      userStore,
    };

    userManager = new UserManager(userManagerConfig);
  }

  return userManager;
};

export const updateUserManager = (settings: UserManagerSettings): void => {
  if (userManager) {
    const updatedSettings: UserManagerSettings = {
      ...userManager.settings,
      ...settings,
      userStore,
    };

    userManager = new UserManager(updatedSettings);
  } else {
    userManager = new UserManager({
      ...settings,
      userStore,
    });
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuthSettings(
      state,
      action: PayloadAction<Partial<OidcClientSettings>>
    ): AuthState {
      const updatedSettings: AuthState = {
        ...state,
        settings: {
          ...state.settings,
          data: {
            ...state.settings.data,
            ...action.payload,
          },
          status: 'succeeded',
        },
      };

      updateUserManager(updatedSettings.settings.data);

      return updatedSettings;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state): AuthState => {
        return {
          ...state,
          user: {
            ...state.user,
            status: 'loading',
          },
        };
      })
      .addCase(
        fetchUser.rejected,
        (
          state,
          action: PayloadAction<ErrorResponse | undefined>
        ): AuthState => {
          return {
            ...state,
            user: {
              ...state.user,
              data: null,
              status: 'failed',
              error: action.payload,
            },
          };
        }
      )
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<AppUser | null>): AuthState => {
          return {
            ...state,
            user: {
              ...state.user,
              data: action.payload,
              status: 'succeeded',
            },
          };
        }
      );
  },
});

export const { updateAuthSettings } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
