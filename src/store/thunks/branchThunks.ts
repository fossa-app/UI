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
  ValidationProblemDetails,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  GeoAddress,
  EntityInput,
} from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { mapBranch, mapBranches, mapError, getFullAddress } from 'shared/helpers';
import { branchClient } from 'shared/configs/BridgeClients';
import { unwrapBridgePagingResponse, unwrapBridgeUnitResult, unwrapBridgeValue } from 'shared/configs/BridgeResponses';
import { BranchQueryRequestModel, BranchModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { AddressModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';

const toBranchModificationAddress = (address: EntityInput<Branch>['address']): AddressModel | null => {
  if (address === null || address === undefined) {
    return null;
  }

  return new AddressModel(
    address.line1 ?? null,
    address.line2 ?? null,
    address.city ?? null,
    address.subdivision ?? null,
    address.postalCode ?? null,
    address.countryCode ?? null
  );
};

export const fetchBranchesTotal = createAsyncThunk<PaginatedResponse<Branch> | undefined, void, { rejectValue: ValidationProblemDetails }>(
  'branch/fetchBranchesTotal',
  async (_, { rejectWithValue }) => {
    try {
      const query = new BranchQueryRequestModel([], '', 1, 1);
      const data = unwrapBridgePagingResponse<Branch>(await branchClient.GetBranchesAsync(query, new AbortController().signal));

      if (!data.items.length) {
        return rejectWithValue({
          status: 404,
          title: MESSAGES.error.branches.notFound,
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ValidationProblemDetails),
        title: MESSAGES.error.branches.notFound,
      });
    }
  }
);

export const fetchBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ValidationProblemDetails }
>('branch/fetchBranches', async ({ pageNumber, pageSize, search }, { getState, rejectWithValue }) => {
  try {
    const query = new BranchQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = unwrapBridgePagingResponse<Branch>(await branchClient.GetBranchesAsync(query, new AbortController().signal));

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
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchAssignedBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ValidationProblemDetails }
>('branch/fetchAssignedBranches', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const query = new BranchQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = unwrapBridgePagingResponse<Branch>(await branchClient.GetBranchesAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchBranchesByIds = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  number[],
  { rejectValue: ValidationProblemDetails }
>('branch/fetchBranchesByIds', async (ids, { rejectWithValue }) => {
  try {
    let idList: bigint[] = [];
    try {
      idList = ids.map((id) => BigInt(id));
    } catch {
      // Ignored
    }

    const query = new BranchQueryRequestModel(idList, '', null, null);
    const data = unwrapBridgePagingResponse<Branch>(await branchClient.GetBranchesAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.branches.notFound,
    });
  }
});

export const fetchBranchById = createAsyncThunk<
  Branch,
  { id: string; skipState?: boolean; shouldFetchBranchGeoAddress?: boolean },
  { rejectValue: ValidationProblemDetails }
>('branch/fetchBranchById', async ({ id, shouldFetchBranchGeoAddress = true }, { getState, dispatch, rejectWithValue }) => {
  try {
    const data = unwrapBridgeValue<Branch>(await branchClient.GetBranchAsync(BigInt(id), new AbortController().signal));
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
    return rejectWithValue(error as ValidationProblemDetails);
  }
});

export const createOnboardingBranch = createAsyncThunk<void, EntityInput<Branch>, { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createOnboardingBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new BranchModificationModel(branch.name, branch.timeZoneId, toBranchModificationAddress(branch.address));
      unwrapBridgeUnitResult(await branchClient.CreateBranchAsync(modModel, new AbortController().signal));

      dispatch(resetBranchesFetchStatus());
      await dispatch(fetchBranchesTotal()).unwrap();

      dispatch(setSuccess(MESSAGES.success.branches.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.branches.create,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const createBranch = createAsyncThunk<void, EntityInput<Branch>, { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new BranchModificationModel(branch.name, branch.timeZoneId, toBranchModificationAddress(branch.address));
      unwrapBridgeUnitResult(await branchClient.CreateBranchAsync(modModel, new AbortController().signal));

      dispatch(resetBranchesFetchStatus());
      dispatch(setBranchesSucceededFlag());
      dispatch(setSuccess(MESSAGES.success.branches.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.branches.create,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editBranch = createAsyncThunk<void, [string, EntityInput<Branch>], { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/editBranch',
  async ([id, branch], { dispatch, rejectWithValue }) => {
    try {
      const modModel = new BranchModificationModel(branch.name, branch.timeZoneId, toBranchModificationAddress(branch.address));
      unwrapBridgeUnitResult(await branchClient.UpdateBranchAsync(BigInt(id), modModel, new AbortController().signal));

      dispatch(setSuccess(MESSAGES.success.branches.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.branches.update,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteBranch = createAsyncThunk<void, Branch['id'], { state: RootState; rejectValue: ValidationProblemDetails }>(
  'branch/deleteBranch',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      unwrapBridgeUnitResult(await branchClient.DeleteBranchAsync(BigInt(id), new AbortController().signal));

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
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.branches.delete,
        })
      );

      return rejectWithValue(error as ValidationProblemDetails);
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
