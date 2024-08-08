import { combineReducers, type Action, type Reducer } from '@reduxjs/toolkit';
import { mapWithPersistor } from './persistence';
import AppReducer, { appApi, storedKeys as storedAppState } from './reducer';
import LoginReducer, { loginApi, storedKeys as storedLoginState } from '@pages/Login/reducer';
import chattingReducer, { chattingApi, storedKeys as storedChattingState } from '@pages/Chatting/reducer';

const storedReducers = {
  app: { reducer: AppReducer, whitelist: storedAppState },
  login: { reducer: LoginReducer, whitelist: storedLoginState },
  chatting: { reducer: chattingReducer, whitelist: storedChattingState },
};

const temporaryReducers: Record<string, Reducer> = {
  // Add temporary reducers here
  // app: AppReducer,
};

const apiReducers: Record<string, Reducer> = {
  // Add api reducers here
  [appApi.reducerPath]: appApi.reducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [chattingApi.reducerPath]: chattingApi.reducer,
};

export default function createReducer(injectedReducer: Record<string, Reducer> = {}): Reducer {
  const coreReducer = combineReducers({
    ...mapWithPersistor(storedReducers),
    ...temporaryReducers,
    ...apiReducers,
    ...injectedReducer,
  });

  const rootReducer: Reducer = (state: ReturnType<typeof coreReducer> | undefined, action: Action) =>
    coreReducer(state, action);

  return rootReducer;
}
