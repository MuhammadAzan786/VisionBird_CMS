import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import socketReducer from "./socketSlice";
import toggleReducer from "./toggleSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reportDateReducer from "./ReportDatesSlice";
import celebrationReducer from "./celebrationSlice"

const rootReducer = combineReducers({
  user: userReducer,
  socket: socketReducer,
  toggle: toggleReducer,
  reportDates: reportDateReducer,
  celebration: celebrationReducer, // Add the celebration reducer here
});


const persistConfig = {
  key: "user",
  version: 1,
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
