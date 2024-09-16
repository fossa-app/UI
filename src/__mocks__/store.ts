import { TypedUseSelectorHook } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DeepPartial } from 'shared/models';
import { RootState } from 'store';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

let mockInitialState: DeepPartial<RootState> = {
  identity: {},
  config: {
    isDarkTheme: false,
  },
  license: {},
};

const store = mockStore(mockInitialState);

export const mockDispatch = jest.fn();
export const useAppDispatch = () => mockDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = (selectorFn) =>
  selectorFn(store.getState() as RootState);

export const setMockState = (state: DeepPartial<RootState>) => {
  mockInitialState = { ...mockInitialState, ...state };
  store.clearActions();
  store.getState = () => mockInitialState as RootState;
};

export default store;
