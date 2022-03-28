import { createSlice } from '@reduxjs/toolkit'

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    drawerOpened: true,
    urlPath: ''
  },
  reducers: {
    openDrawer: (state) => {
      state.drawerOpened = true
    },
    closeDrawer: (state) => {
      state.drawerOpened = false
    },
    setUrlPath: (state, action) => {
      state.urlPath = action.payload
    }
  }
})

export default homeSlice.reducer

export const { openDrawer, closeDrawer, setUrlPath } = homeSlice.actions
