let userManagerInstance: MockUserManager;

export class MockUserManager {
  signinRedirect = jest.fn();
  signinRedirectCallback = jest.fn();
  signoutRedirect = jest.fn();
}

export const WebStorageStateStore = jest.fn().mockImplementation(() => {
  return {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  };
});

export const UserManager = jest.fn().mockImplementation(() => {
  if (!userManagerInstance) {
    userManagerInstance = new MockUserManager();
  }
  return userManagerInstance;
});

export const getUserManager = jest.fn(() => {
  if (!userManagerInstance) {
    userManagerInstance = new MockUserManager();
  }
  return userManagerInstance;
});
