import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Ironclad | Programmable Bitcoin Savings Protocol",
  description:
    "Trustless, rule-based BTC commitments secured by Bitcoin finality. Build generational wealth without custodial risk.",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/logo.png?v=1" />
        <link rel="apple-touch-icon" href="/assets/logo.png?v=1" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <AppProviders>
            {children}
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
