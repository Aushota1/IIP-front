import { getUserProfileMock } from '../mock/user';
import { fetchUserProfile as fetchUserProfileApi } from '../api';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export const fetchUserProfile = () =>
  USE_MOCK ? getUserProfileMock() : fetchUserProfileApi();
