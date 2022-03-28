import { createSlice } from '@reduxjs/toolkit'

const identitySlice = createSlice({
  name: 'identity',
  initialState: {
    token: ''
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    }
  }
})

export default identitySlice.reducer

export const { setToken } = identitySlice.actions
