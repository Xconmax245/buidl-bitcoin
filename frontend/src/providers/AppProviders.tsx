"use client";

import { ReactNode } from "react";
import { Connect } from "@stacks/connect-react";
import { WalletProvider, appConfig, sharedUserSession } from "@/providers/WalletProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <Connect
        authOptions={{
          appDetails: {
            name: "Ironclad",
            icon: typeof window !== "undefined" ? `${window.location.origin}/icon.png` : "/icon.png",
          },
          userSession: sharedUserSession,
          onFinish: () => {
            window.location.reload();
          },
        }}
      >
        <WalletProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </WalletProvider>
      </Connect>
    </AuthProvider>
  );
}
