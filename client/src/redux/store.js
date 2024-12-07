import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import socketReducer from "./socketSlice";
import toggleReducer from "./toggleSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reportDateReducer from "./ReportDatesSlice";
import celebrationReducer from "./celebrationSlice";
import notificationReducer from "./notification/notificationSlice";

const rootReducer = combineReducers({
  user: userReducer,
  socket: socketReducer,
  toggle: toggleReducer,
  reportDates: reportDateReducer,
  celebration: celebrationReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: "user",
  version: 1,
  storage,
  whitelist: ["user", "notifications"],
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

// const userPersistConfig = {
//   key: "user", // Key for the user data
//   version: 1,
//   storage,
// };

// const notificationsPersistConfig = {
//   key: "notifications", // Key for the notifications data
//   version: 1,
//   storage,
// };

// // Persisted reducers
// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
// const persistedNotificationsReducer = persistReducer(notificationsPersistConfig, notificationReducer);

// // Combine reducers
// const rootReducer = combineReducers({
//   user: persistedUserReducer,
//   socket: socketReducer,
//   toggle: toggleReducer,
//   reportDates: reportDateReducer,
//   celebration: celebrationReducer,
//   notifications: persistedNotificationsReducer,
// });

// // Configure the store with the rootReducer (which includes the persisted reducers)
// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// // Create persistor
// export const persistor = persistStore(store);
// export default store;
