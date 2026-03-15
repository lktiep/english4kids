"use client";

import { AuthProvider } from "../context/AuthContext";
import { I18nProvider } from "../context/i18nContext";

export function AuthProviderWrapper({ children }) {
  return (
    <AuthProvider>
      <I18nProvider>{children}</I18nProvider>
    </AuthProvider>
  );
}
