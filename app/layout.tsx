// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Bar from "./Bar"; // Asegúrate de usar la ruta correcta
import { WalletProvider } from "./context/walletContext"; // Importamos el proveedor

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supra Spike",
  description: "Supra Memecoin Spike",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Envolvemos todo el contenido de la app en el WalletProvider */}
        <WalletProvider>
          <Bar />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
