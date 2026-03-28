import { registerUserMock, loginUserMock, fetchUserProfileMock } from '../mock/auth';
import { registerUser as registerUserApi, loginUser as loginUserApi, fetchUserProfile as fetchUserProfileApi } from '../api';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || true;

export const registerUser = (userData) =>
  USE_MOCK ? registerUserMock(userData) : registerUserApi(userData);

export const loginUser = (credentials) =>
  USE_MOCK ? loginUserMock(credentials) : loginUserApi(credentials);

export const fetchUserProfile = () =>
  USE_MOCK ? fetchUserProfileMock() : fetchUserProfileApi();
