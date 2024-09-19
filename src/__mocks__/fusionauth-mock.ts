const mockInitialState = {
  isLoggedIn: false,
  isFetchingUserInfo: false,
  userInfo: {},
  startLogin: jest.fn(),
  startLogout: jest.fn(),
};

let mockState = mockInitialState;

export const setFusionAuthMock = (newState: any) => {
  mockState = { ...mockState, ...newState };
};

export const useFusionAuth = jest.fn(() => mockState);
