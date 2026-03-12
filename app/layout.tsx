import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "My Base App",
  description: "Simple Base Sepolia dApp with wallet and transaction",
  openGraph: {
    title: "My Base App",
    description: "Simple Base Sepolia dApp with wallet and transaction",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Base App",
      },
    ],
  },
  other: {
    "base:app_id": "69b34c70b0c19c0fc281a8d3",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}