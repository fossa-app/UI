import { TypedUseSelectorHook } from 'react-redux';
import configureStore from 'redux-mock-store';
import { RootState } from 'store';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

const initialState = {
  identity: {},
  config: {},
  license: {},
} as RootState;

const store = mockStore(initialState);
const mockDispatch = jest.fn();

export const useAppDispatch = jest.fn(() => mockDispatch);
export const useAppSelector = jest.fn((selectorFn) =>
  selectorFn(initialState as unknown as TypedUseSelectorHook<RootState>)
);

export default store;
