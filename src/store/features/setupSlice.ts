import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { RootState } from 'store';
import { Company, ErrorResponse, StateEntity } from 'shared/models';
import { URLS } from 'shared/constants';

interface SetupState {
  company: StateEntity<Company | null>;
}

const initialState: SetupState = {
  company: {
    data: null,
    status: 'idle',
  },
};

export const fetchCompany = createAsyncThunk<
  Company | null,
  void,
  { rejectValue: ErrorResponse }
>('setup/fetchCompany', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<Company>(URLS.company);

    if (data) {
      return data;
    }

    return null;
  } catch (error) {
    return rejectWithValue(error as ErrorResponse);
  }
});

export const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCompany.pending, (state): SetupState => {
        return {
          ...state,
          company: {
            ...state.company,
            status: 'loading',
          },
        };
      })
      .addCase(
        fetchCompany.rejected,
        (
          state,
          action: PayloadAction<ErrorResponse | undefined>
        ): SetupState => {
          return {
            ...state,
            company: {
              ...state.company,
              data: null,
              status: 'failed',
              error: action.payload,
            },
          };
        }
      )
      .addCase(
        fetchCompany.fulfilled,
        (state, action: PayloadAction<Company | null>): SetupState => {
          return {
            ...state,
            company: {
              ...state.company,
              data: action.payload,
              status: 'succeeded',
            },
          };
        }
      );
  },
});

export const selectCompany = (state: RootState) => state.setup.company;

export default setupSlice.reducer;
