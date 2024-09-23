import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  UserManager,
  WebStorageStateStore,
  UserManagerSettings,
  User,
} from 'oidc-client-ts';
import { RootState } from 'store';
import { ErrorResponse, Status } from 'shared/models';
import { OIDC_INITIAL_CONFIG } from 'shared/constants';
import { mapUser } from 'shared/helpers';

interface AuthState {
  settings: Omit<UserManagerSettings, 'userStore'>;
  // TODO: create a generic interface for this structure// TODO: create a generic interface for this structure
  user: {
    data: Partial<User> | null;
    status: Status;
    error?: ErrorResponse;
  };
  status: Status;
  error?: ErrorResponse;
}

const initialState: AuthState = {
  settings: OIDC_INITIAL_CONFIG,
  user: {
    data: null,
    status: 'idle',
  },
  status: 'idle',
};

const userStore = new WebStorageStateStore({
  store: window.localStorage,
  prefix: 'oidc.',
});

let userManager: UserManager | null = null;

export const fetchUser = createAsyncThunk<
  Partial<User> | null,
  void,
  { rejectValue: ErrorResponse }
>('auth/fetchUser', async (_, { rejectWithValue }) => {
  const userManager = getUserManager();

  try {
    const user = await userManager.getUser();

    if (user) {
      return mapUser(user);
    }

    return rejectWithValue({ title: 'No user found' });
  } catch (error) {
    return rejectWithValue(error as ErrorResponse);
  }
});

export const getUserManager = (): UserManager => {
  if (!userManager) {
    const settings = initialState.settings;

    const userManagerConfig: UserManagerSettings = {
      ...settings,
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
      action: PayloadAction<Partial<AuthState>>
    ): AuthState {
      const updatedSettings: AuthState = {
        ...state,
        ...action.payload,
        status: 'succeeded',
      };

      updateUserManager(updatedSettings.settings);

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
        (state, action: PayloadAction<Partial<User> | null>): AuthState => {
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
