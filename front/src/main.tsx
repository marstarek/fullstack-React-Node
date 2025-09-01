import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import AppRoute from "./router/AppRoute";
import "./index.css";
import { Toaster } from "react-hot-toast";
// Create one QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: { background: "#333", color: "#fff" },
      }}
    />
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoute />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);