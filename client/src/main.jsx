import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.js";
import { ThemeProvider } from "@mui/material/styles";
import { MessageProvider } from "./components/MessageContext.jsx";
import { customTheme } from "./theme/customTheme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <MessageProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <App />
          </PersistGate>
        </Provider>
      </MessageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
