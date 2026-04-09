import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserManager, mapUser } from 'shared/helpers';
import { AppUser } from 'shared/types';

export const fetchUser = createAsyncThunk<AppUser | undefined, void>('auth/fetchUser', async () => {
  const user = await getUserManager().getUser();

  if (user) {
    return mapUser(user);
  }

  throw new Error('No authenticated user');
});
