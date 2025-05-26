"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./store"; // Import your Redux store
// import { ColorProvider } from "@/hooks/colorContext"; // Import ColorProvider

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </SessionProvider>
    </Provider>
  );
}
