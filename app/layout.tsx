import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "My Base App",
  description: "Красивое приложение на Base Sepolia с кошельком и транзакцией.",
  openGraph: {
    title: "My Base App",
    description:
      "Красивое приложение на Base Sepolia с кошельком и транзакцией.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Base App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Base App",
    description:
      "Красивое приложение на Base Sepolia с кошельком и транзакцией.",
    images: ["/og-image.png"],
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