import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice';
import { api } from './api';
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, 
    blogs: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
