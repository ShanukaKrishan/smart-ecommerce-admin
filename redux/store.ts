import { configureStore } from '@reduxjs/toolkit'
// reducers
import homeReducer from './reducers/homeReducer'
import identityReducer from './reducers/identityReducer'

const store = configureStore({
  reducer: {
    identity: identityReducer,
    home: homeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store
