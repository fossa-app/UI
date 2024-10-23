import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Status } from 'shared/models';

const isBrowserDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

interface ConfigState {
  isDarkTheme: boolean;
  sideBarOpened: boolean;
  status: Status;
}

const initialState: ConfigState = {
  isDarkTheme: isBrowserDarkMode,
  sideBarOpened: false,
  status: 'idle',
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    toggleAppTheme(state, action: PayloadAction<ConfigState['isDarkTheme']>) {
      state.isDarkTheme = action.payload;
      state.status = 'succeeded';
    },
    openSideBar: (state) => {
      state.sideBarOpened = true;
    },
    closeSidebar: (state) => {
      state.sideBarOpened = false;
    },
  },
});

export const { toggleAppTheme, openSideBar, closeSidebar } = appConfigSlice.actions;

export const selectAppConfig = (state: RootState) => state.appConfig;

export default appConfigSlice.reducer;
