"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        theme="light"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid #e4dfd6",
            color: "#1c1916",
            fontFamily: "var(--font-pretendard), Pretendard, sans-serif",
          },
        }}
      />
    </QueryClientProvider>
  );
};
