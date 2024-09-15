import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { ErrorResponse, Status, System } from 'shared/models';
import { URLS } from 'shared/constants';
import { RootState } from 'store';

interface LicenseState {
  system: System | null;
  status: Status;
  error?: ErrorResponse;
}

const initialState: LicenseState = {
  system: null,
  status: 'idle',
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
          status: 'loading',
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
            status: 'failed',
            error: action.payload,
          };
        }
      )
      .addCase(
        fetchSystem.fulfilled,
        (state, action: PayloadAction<System | null>): LicenseState => {
          return {
            ...state,
            system: action.payload,
            status: 'succeeded',
          };
        }
      );
  },
});

export const selectLicense = (state: RootState) => state.license;

export default licenseSlice.reducer;
