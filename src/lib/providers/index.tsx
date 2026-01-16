"use client";

import { Provider } from "jotai";
import { QueryProvider } from "./query-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
};
