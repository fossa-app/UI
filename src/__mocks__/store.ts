import { TypedUseSelectorHook } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DeepPartial } from 'shared/models';
import { RootState } from 'store';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

const initialMockState: DeepPartial<RootState> = {
  identity: {},
  appConfig: {
    isDarkTheme: false,
  },
  license: {},
  auth: {
    user: {
      data: null,
    },
  },
};

let mockInitialState = { ...initialMockState };
const store = mockStore(mockInitialState);

export const mockDispatch = jest.fn();
export const useAppDispatch = () => mockDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = (selectorFn) => selectorFn(store.getState() as RootState);

export const setMockState = (state: DeepPartial<RootState>) => {
  mockInitialState = { ...initialMockState, ...state };
  store.clearActions();
  store.getState = () => mockInitialState as RootState;
};

export const resetMockState = () => {
  mockInitialState = { ...initialMockState };
  store.clearActions();
  store.getState = () => mockInitialState as RootState;
};

export default store;
