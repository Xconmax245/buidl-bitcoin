"use client";

import { ReactNode, useEffect, useState } from "react";
import { WalletProvider } from "@/providers/WalletProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";

function StacksConnectWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [ConnectComponent, setConnectComponent] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Stacks libraries only on the client side
    Promise.all([
      import("@stacks/connect-react"),
      import("@stacks/connect"),
    ]).then(([connectReact, connect]) => {
      const { AppConfig, UserSession } = connect;
      const appConfig = new AppConfig(["store_write", "publish_data"]);
      const userSession = new UserSession({ appConfig });

      setConnectComponent(() => connectReact.Connect);
      setSessionData({ appConfig, userSession });
      setMounted(true);
    }).catch((err) => {
      console.error("Failed to load Stacks Connect:", err);
      setMounted(true); // Still mount children even if Stacks fails
    });
  }, []);

  if (!mounted || !ConnectComponent || !sessionData) {
    // Render children without Stacks Connect wrapper while loading
    return <>{children}</>;
  }

  return (
    <ConnectComponent
      authOptions={{
        appDetails: {
          name: "Ironclad",
          icon: `${window.location.origin}/icon.png`,
        },
        userSession: sessionData.userSession,
        onFinish: () => {
          window.location.reload();
        },
      }}
    >
      {children}
    </ConnectComponent>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <StacksConnectWrapper>
        <WalletProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </WalletProvider>
      </StacksConnectWrapper>
    </AuthProvider>
  );
}
