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
import { Branch, ProblemDetailsModel, ErrorResponse, PaginatedResponse, PaginationParams, GeoAddress, EntityInput } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { mapBranch, mapBranches, mapError, getFullAddress, createProblemDetails } from 'shared/helpers';
import { branchClient } from 'shared/configs/BridgeClients';
import { toPaginatedResponse } from 'shared/configs/BridgeResponses';
import { matchClientResult, matchClientUnitResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import type { ClientResult$1_$union } from '@fossa-app/bridge/Models/ClientResults';
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

export const fetchBranchesTotal = createAsyncThunk<PaginatedResponse<Branch> | undefined, void, { rejectValue: ProblemDetailsModel }>(
  'branch/fetchBranchesTotal',
  async (_, { rejectWithValue }) => {
    const query = new BranchQueryRequestModel([], '', 1, 1);
    const result = await branchClient.getBranchesAsync(query, new AbortController().signal);

    return matchClientResult(
      result,
      (response) => toPaginatedResponse<Branch>(response),
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.branches.notFound })) as never
    );
  }
);

export const fetchBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ProblemDetailsModel }
>('branch/fetchBranches', async ({ pageNumber, pageSize, search }, { getState, rejectWithValue }) => {
  const query = new BranchQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
  const result = await branchClient.getBranchesAsync(query, new AbortController().signal);

  return matchClientResult(
    result,
    (response) => {
      const data = toPaginatedResponse<Branch>(response);

      const state = getState() as RootState;
      const timeZones = state.license.system.item?.entitlements.timeZones || [];
      const countries = state.license.system.item?.entitlements.countries || [];
      const companyCountryCode = state.company.company.item!.countryCode;

      return {
        ...data,
        items: mapBranches(data.items, timeZones, companyCountryCode, countries),
      };
    },
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.branches.notFound })) as never
  );
});

export const fetchAssignedBranches = createAsyncThunk<
  PaginatedResponse<Branch> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ProblemDetailsModel }
>('branch/fetchAssignedBranches', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  const query = new BranchQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
  const result = await branchClient.getBranchesAsync(query, new AbortController().signal);

  return matchClientResult(
    result,
    (response) => toPaginatedResponse<Branch>(response),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.branches.notFound })) as never
  );
});

export const fetchBranchesByIds = createAsyncThunk<PaginatedResponse<Branch> | undefined, number[], { rejectValue: ProblemDetailsModel }>(
  'branch/fetchBranchesByIds',
  async (ids, { rejectWithValue }) => {
    let idList: bigint[] = [];
    try {
      idList = ids.map((id) => BigInt(id));
    } catch {
      // Ignored
    }

    const query = new BranchQueryRequestModel(idList, '', null, null);
    const result = await branchClient.getBranchesAsync(query, new AbortController().signal);

    return matchClientResult(
      result,
      (response) => toPaginatedResponse<Branch>(response),
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.branches.notFound })) as never
    );
  }
);

export const fetchBranchById = createAsyncThunk<
  Branch,
  { id: string; skipState?: boolean; shouldFetchBranchGeoAddress?: boolean },
  { rejectValue: ProblemDetailsModel }
>('branch/fetchBranchById', async ({ id, shouldFetchBranchGeoAddress = true }, { getState, dispatch, rejectWithValue }) => {
  try {
    const result = await branchClient.getBranchAsync(BigInt(id), new AbortController().signal);
    return matchClientResult(
      result,
      async (data) => {
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
      },
      (problem) => rejectWithValue(problem) as never
    );
  } catch (error) {
    return rejectWithValue(error as ProblemDetailsModel);
  }
});

export const createOnboardingBranch = createAsyncThunk<void, EntityInput<Branch>, { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createOnboardingBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    const modModel = new BranchModificationModel(branch.name, branch.timeZoneId, toBranchModificationAddress(branch.address));

    return matchClientUnitResult(
      await branchClient.createBranchAsync(modModel, new AbortController().signal),
      async () => {
        dispatch(resetBranchesFetchStatus());
        await dispatch(fetchBranchesTotal()).unwrap();

        dispatch(setSuccess(MESSAGES.success.branches.create));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.branches.create })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const createBranch = createAsyncThunk<void, EntityInput<Branch>, { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/createBranch',
  async (branch, { dispatch, rejectWithValue }) => {
    const modModel = new BranchModificationModel(branch.name, branch.timeZoneId, toBranchModificationAddress(branch.address));

    return matchClientUnitResult(
      await branchClient.createBranchAsync(modModel, new AbortController().signal),
      () => {
        dispatch(resetBranchesFetchStatus());
        dispatch(setBranchesSucceededFlag());
        dispatch(setSuccess(MESSAGES.success.branches.create));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.branches.create })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const editBranch = createAsyncThunk<void, [string, EntityInput<Branch>], { rejectValue: ErrorResponse<FieldValues> }>(
  'branch/editBranch',
  async ([id, branch], { dispatch, rejectWithValue }) => {
    const modModel = new BranchModificationModel(branch.name, branch.timeZoneId, toBranchModificationAddress(branch.address));

    return matchClientUnitResult(
      await branchClient.updateBranchAsync(BigInt(id), modModel, new AbortController().signal),
      () => {
        dispatch(setSuccess(MESSAGES.success.branches.update));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.branches.update })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const deleteBranch = createAsyncThunk<void, Branch['id'], { state: RootState; rejectValue: ProblemDetailsModel }>(
  'branch/deleteBranch',
  async (id, { dispatch, getState, rejectWithValue }) => {
    return matchClientUnitResult(
      await branchClient.deleteBranchAsync(BigInt(id), new AbortController().signal),
      () => {
        dispatch(resetBranchesFetchStatus());
        dispatch(resetCompanyDatasourceTotalsFetchStatus());
        dispatch(setSuccess(MESSAGES.success.branches.delete));

        const state = getState() as RootState;
        const { branchCatalog } = state.branch;

        if (branchCatalog.page.totalItems === 1) {
          dispatch(setBranchesFailedFlag());
        }
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.branches.delete })));

        return rejectWithValue(problem) as never;
      }
    );
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
