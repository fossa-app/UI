import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import {
  setError,
  setSuccess,
  setBranchesFailedFlag,
  setBranchesSucceededFlag,
  resetBranchesFetchStatus,
  resetCompanyDatasourceTotalsFetchStatus,
} from 'store/features';
import axios from 'shared/configs/axios';
import {
  Branch,
  BranchDTO,
  ErrorResponseDTO,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  GeoAddress,
  EntityInput,
} from 'shared/models';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import {
  mapBranch,
  mapBranches,
  mapError,
  prepareQueryParams,
  prepareCommaSeparatedQueryParamsByKey,
  getFullAddress,
} from 'shared/helpers';

export const fetchBranchesTotal = createAsyncThunk<PaginatedResponse<BranchDTO> | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'branch/fetchBranchesTotal',
  async (_, { rejectWithValue }) => {
    try {
      const queryParams = prepareQueryParams({ pageNumber: 1, pageSize: 1 });
      const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

      if (!data.items.length) {
        return rejectWithValue({
          status: 404,
          title: MESSAGES.error.branches.notFound,
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.branches.notFound,
      });
    }
  }
);

export const fetchBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ErrorResponseDTO }
>('branch/fetchBranches', async ({ pageNumber, pageSize, search }, { getState, rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

    if (!data.items.length) {
      return rejectWithValue({
        status: 404,
        title: MESSAGES.error.branches.notFound,
      });
    }

    const state = getState() as RootState;
    const timeZones = state.license.system.item?.entitlements.timeZones || [];
    const countries = state.license.system.item?.entitlements.countries || [];
    const companyCountryCode = state.company.company.item!.countryCode;

    return {
      ...data,
      items: mapBranches(data.items, timeZones, companyCountryCode, countries),
    };
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchSearchedBranches = createAsyncThunk<
  PaginatedResponse<BranchDTO> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ErrorResponseDTO }
>('branch/fetchSearchedBranches', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchAssignedBranches = createAsyncThunk<
  PaginatedResponse<BranchDTO> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ErrorResponseDTO }
>('branch/fetchAssignedBranches', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchBranchesByIds = createAsyncThunk<PaginatedResponse<BranchDTO> | undefined, number[], { rejectValue: ErrorResponseDTO }>(
  'branch/fetchBranchesByIds',
  async (ids, { rejectWithValue }) => {
    try {
      const queryParams = prepareCommaSeparatedQueryParamsByKey('id', ids);
      const { data } = await axios.get<PaginatedResponse<BranchDTO>>(`${ENDPOINTS.branches}?${queryParams}`);

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.branches.notFound,
      });
    }
  }
);

export const fetchBranchById = createAsyncThunk<
  Branch,
  { id: string; skipState?: boolean; shouldFetchBranchGeoAddress?: boolean },
  { rejectValue: ErrorResponseDTO }
>('branch/fetchBranchById', async ({ id, shouldFetchBranchGeoAddress = true }, { getState, dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.get<BranchDTO>(`${ENDPOINTS.branches}/${id}`);
    const state = getState() as RootState;
    const timeZones = state.license.system.item?.entitlements.timeZones || [];
    const countries = state.license.system.item?.entitlements.countries || [];
    const companyCountryCode = state.company.company.item!.countryCode;
    const countryName = countries.find((country) => country.code === data.address?.countryCode)?.name;
    const fullAddress = data.address ? getFullAddress({ ...data.address, countryName }, false) : '';
    let geoAddress: GeoAddress | undefined;

    if (shouldFetchBranchGeoAddress) {
      geoAddress = await dispatch(fetchGeoAddress(fullAddress)).unwrap();
    }

    return mapBranch({
      branch: data,
      timeZones,
      companyCountryCode,
      countries,
      geoAddress,
    });
  } catch (error) {
    return rejectWithValue(error as ErrorResponseDTO);
  }
});

export const createOnboardingBranch = createAsyncThunk<void, EntityInput<BranchDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createOnboardingBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.branches, branch);

      dispatch(resetBranchesFetchStatus());
      await dispatch(fetchBranchesTotal()).unwrap();

      dispatch(setSuccess(MESSAGES.success.branches.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const createBranch = createAsyncThunk<void, EntityInput<BranchDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.branches, branch);

      dispatch(resetBranchesFetchStatus());
      dispatch(setBranchesSucceededFlag());
      dispatch(setSuccess(MESSAGES.success.branches.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editBranch = createAsyncThunk<void, [string, EntityInput<BranchDTO>], { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/editBranch',
  async ([id, branch], { dispatch, rejectWithValue }) => {
    try {
      await axios.put<void>(`${ENDPOINTS.branches}/${id}`, branch);

      dispatch(setSuccess(MESSAGES.success.branches.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.update,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteBranch = createAsyncThunk<void, BranchDTO['id'], { state: RootState; rejectValue: ErrorResponseDTO }>(
  'branch/deleteBranch',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.delete<void>(`${ENDPOINTS.branches}/${id}`);

      dispatch(resetBranchesFetchStatus());
      dispatch(resetCompanyDatasourceTotalsFetchStatus());
      dispatch(setSuccess(MESSAGES.success.branches.delete));

      const state = getState() as RootState;
      const { branchCatalog } = state.branch;

      if (branchCatalog.page.totalItems === 1) {
        dispatch(setBranchesFailedFlag());
      }
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.branches.delete,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const fetchGeoAddress = createAsyncThunk<GeoAddress | undefined, string | undefined>('location/geocodeAddress', async (address) => {
  if (!address) {
    return;
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: { 'Accept-Language': 'en' },
    });

    if (response.data?.length > 0) {
      const { lat, lon, display_name } = response.data[0];

      return {
        lat: Number(parseFloat(lat).toFixed(7)),
        lng: Number(parseFloat(lon).toFixed(7)),
        label: display_name,
      };
    }

    return;
  } catch {
    return;
  }
});
