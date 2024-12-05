import App from "./App.jsx";
import { MessageProvider } from "./components/MessageContext.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { customTheme } from "./theme/customTheme.js";
import { persistor } from "./redux/store.js";
import store from "./redux/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed queries 3 times
      cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
      staleTime: 1000 * 60, // Data is fresh for 1 minute
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customTheme}>
        <MessageProvider>
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
              <App />
            </PersistGate>
          </Provider>
        </MessageProvider>
      </ThemeProvider>
      {/** React Query Devtools */}
      {import.meta.env.VITE_NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
