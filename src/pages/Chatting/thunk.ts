import { createAsyncThunk } from '@reduxjs/toolkit';
import { getContacts } from '@service/api';

export const doGetContacts = createAsyncThunk('chatting/getContacts', async (_, { rejectWithValue }) => {
  try {
    const response = await getContacts();
    return response;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
});
