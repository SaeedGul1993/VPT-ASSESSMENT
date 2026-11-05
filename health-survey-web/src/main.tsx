import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import AppThemeProvider from "./components/themeProvider/ThemeProvider";
import PageLoader from "./components/pageLoader/PageLoader";
import { persistStored, store } from "./store";
import { applyTheme, getStoredTheme } from "./utils/theme";
import "./index.css";

applyTheme(getStoredTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistStored}>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
