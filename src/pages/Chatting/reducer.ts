import type { RootState } from '../../store/stores';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface IChattingState {
  messages: string[];
  isLoading: boolean;
  contacts: object[];
}

const initialState: IChattingState = {
  messages: [],
  isLoading: false,
  contacts: [],
};

export const storedKeys = ['contacts'];

const selectAccessToken = (state: RootState) => state.login.access_token;

export const chattingApi = createApi({
  reducerPath: 'chattingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env['VITE_API_URL']}/api/starter`,
    prepareHeaders: (headers, { getState }) => {
      const token = selectAccessToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: () => ({
        url: '/chatting/contacts',
        method: 'GET',
      }),
    }),
    postMessage: builder.mutation({
      query: (body) => ({
        url: '/chatting/messages',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const chattingSlice = createSlice({
  name: 'chatting',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setContacts: (state, action: PayloadAction<object[]>) => {
      state.contacts = action.payload;
    },
  },
});

export const { useGetContactsQuery, usePostMessageMutation } = chattingApi;

export const { setMessages, setLoading, setContacts } = chattingSlice.actions;

export default chattingSlice.reducer;
