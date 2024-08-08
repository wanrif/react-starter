import type { RootState } from '@app/stores';

export const selectIsAuthenticated = (state: RootState) => state.login.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.login.accessToken;
export const selectRefreshToken = (state: RootState) => state.login.refreshToken;
export const selectLoginLoading = (state: RootState) => state.login.isLoadingLogin;
