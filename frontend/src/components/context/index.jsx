import React from "react";

import NotificationProvider from "./NotificationProvider.jsx";
import AuthProvider from "./AuthProvider.jsx";
import ThemeProvider from "./ThemeProvider.jsx";

export default function ContextProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
