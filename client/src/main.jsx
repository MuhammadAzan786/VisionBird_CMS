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
