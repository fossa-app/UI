export const useFusionAuth = jest.fn(() => ({
  isLoggedIn: false,
  isFetchingUserInfo: false,
  startLogin: jest.fn(),
}));
