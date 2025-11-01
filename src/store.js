// store.js
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './features/sessionSlice';

const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});

export default store;
