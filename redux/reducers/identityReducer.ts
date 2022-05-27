import { createSlice } from '@reduxjs/toolkit';

const identitySlice = createSlice({
  name: 'identity',
  initialState: {
    token: '',
    superAdmin: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSuperAdmin: (state, action) => {
      state.superAdmin = action.payload;
    },
  },
});

export default identitySlice.reducer;

export const { setToken, setSuperAdmin } = identitySlice.actions;
