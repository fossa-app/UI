import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBranchesTotal, fetchCompanySettings, fetchCompany, fetchCompanyLicense, fetchProfile } from 'store/thunks';
import { ErrorResponseDTO } from 'shared/models';

export const fetchOnboardingData = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'onboarding/fetchOnboardingData',
  async (_, { dispatch }) => {
    try {
      const companyResponse = await dispatch(fetchCompany(true)).unwrap();

      if (!companyResponse) {
        return;
      }

      try {
        await dispatch(fetchCompanyLicense()).unwrap();
      } catch {
        // We expect an error here
      }

      try {
        await dispatch(fetchCompanySettings()).unwrap();
      } catch {
        // We expect an error here
      }

      try {
        await dispatch(fetchBranchesTotal()).unwrap();
      } catch {
        // We expect an error here
      }

      try {
        await dispatch(fetchProfile()).unwrap();
      } catch {
        // We expect an error here
      }
    } catch {
      dispatch({ type: 'onboarding/setOnboardingFailed' });
    }
  }
);
