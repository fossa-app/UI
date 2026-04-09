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
import {
  Branch,
  BranchDTO,
  ErrorResponseDTO,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  GeoAddress,
  EntityInput,
} from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { mapBranch, mapBranches, mapError, getFullAddress } from 'shared/helpers';
import { branchClient } from 'shared/configs/BridgeClients';
import { BranchQueryRequestModel, BranchModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { AddressModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';

export const fetchBranchesTotal = createAsyncThunk<PaginatedResponse<BranchDTO> | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'branch/fetchBranchesTotal',
  async (_, { rejectWithValue }) => {
    try {
      const query = new BranchQueryRequestModel([], '', 1, 1);
      const data = (await branchClient.GetBranchesAsync(query, new AbortController().signal)) as unknown as PaginatedResponse<BranchDTO>;

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
    const query = new BranchQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = (await branchClient.GetBranchesAsync(query, new AbortController().signal)) as unknown as PaginatedResponse<BranchDTO>;

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

export const fetchAssignedBranches = createAsyncThunk<
  PaginatedResponse<BranchDTO> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ErrorResponseDTO }
>('branch/fetchAssignedBranches', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const query = new BranchQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = (await branchClient.GetBranchesAsync(query, new AbortController().signal)) as unknown as PaginatedResponse<BranchDTO>;

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
      let idList: bigint[] = [];
      try {
        idList = ids.map((id) => BigInt(id));
      } catch {
        // Ignored
      }

      const query = new BranchQueryRequestModel(idList, '', null, null);
      const data = (await branchClient.GetBranchesAsync(query, new AbortController().signal)) as unknown as PaginatedResponse<BranchDTO>;

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
    const data = (await branchClient.GetBranchAsync(BigInt(id), new AbortController().signal)) as unknown as BranchDTO;
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
      const modModel = new BranchModificationModel(
        branch.name,
        branch.timeZoneId,
        branch.address
          ? new AddressModel(
              branch.address.line1 || '',
              branch.address.line2 || '',
              branch.address.city || '',
              branch.address.subdivision || '',
              branch.address.postalCode || '',
              branch.address.countryCode || ''
            )
          : new AddressModel('', '', '', '', '', '')
      );
      await branchClient.CreateBranchAsync(modModel, new AbortController().signal);

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
      const modModel = new BranchModificationModel(
        branch.name,
        branch.timeZoneId,
        branch.address
          ? new AddressModel(
              branch.address.line1 || '',
              branch.address.line2 || '',
              branch.address.city || '',
              branch.address.subdivision || '',
              branch.address.postalCode || '',
              branch.address.countryCode || ''
            )
          : new AddressModel('', '', '', '', '', '')
      );
      await branchClient.CreateBranchAsync(modModel, new AbortController().signal);

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
      const modModel = new BranchModificationModel(
        branch.name,
        branch.timeZoneId,
        branch.address
          ? new AddressModel(
              branch.address.line1 || '',
              branch.address.line2 || '',
              branch.address.city || '',
              branch.address.subdivision || '',
              branch.address.postalCode || '',
              branch.address.countryCode || ''
            )
          : new AddressModel('', '', '', '', '', '')
      );
      await branchClient.UpdateBranchAsync(BigInt(id), modModel, new AbortController().signal);

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
      await branchClient.DeleteBranchAsync(BigInt(id), new AbortController().signal);

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
    const url = new window.URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', address);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');

    const response = await fetch(url.toString(), {
      headers: { 'Accept-Language': 'en' },
    });
    const parsedData = await response.json();

    if (parsedData?.length > 0) {
      const { lat, lon, display_name } = parsedData[0];

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
