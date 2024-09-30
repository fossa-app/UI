import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { ErrorResponse, StateEntity, System } from 'shared/models';
import { URLS } from 'shared/constants';
import { RootState } from 'store';

interface LicenseState {
  system: StateEntity<System | null>;
}

const initialState: LicenseState = {
  system: {
    data: null,
    status: 'idle',
  },
};

export const fetchSystem = createAsyncThunk<
  System | null,
  void,
  { rejectValue: ErrorResponse }
>('license/fetchSystem', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<System>(URLS.system);

    if (data) {
      return data;
    }

    return null;
  } catch (error) {
    return rejectWithValue(error as ErrorResponse);
  }
});

export const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSystem.pending, (state): LicenseState => {
        return {
          ...state,
          system: {
            ...state.system,
            status: 'loading',
          },
        };
      })
      .addCase(
        fetchSystem.rejected,
        (
          state,
          action: PayloadAction<ErrorResponse | undefined>
        ): LicenseState => {
          return {
            ...state,
            system: {
              ...state.system,
              data: null,
              status: 'failed',
              error: action.payload,
            },
          };
        }
      )
      .addCase(
        fetchSystem.fulfilled,
        (state, action: PayloadAction<System | null>): LicenseState => {
          return {
            ...state,
            system: {
              ...state.system,
              data: action.payload,
              status: 'succeeded',
            },
          };
        }
      );
  },
});

export const selectSystem = (state: RootState) => state.license.system;

export default licenseSlice.reducer;