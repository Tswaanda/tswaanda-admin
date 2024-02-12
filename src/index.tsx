import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/main.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Notifications } from "react-push-notification";
// ts-ignore
import { store } from "./state/Store";
import { AuthProvider } from "./hooks/auth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Notifications />
      <AuthProvider>
        <App />
      </AuthProvider>
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
